/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import HaikuElement from '../HaikuElement'
import Layout3D from '../Layout3D'
import invertMatrix from '../vendor/gl-mat4/invert'
import createMatrix from '../vendor/gl-mat4/create'
import SVGPoints from './SVGPoints'
import visitManaTree from './visitManaTree';
import getElementSize from '../renderers/dom/getElementSize';
import invert from '../vendor/gl-mat4/invert';

export const LINE_SELECTION_THRESHOLD = 5 // Number of pixels allowance for a line to be selected
export const CUBIC_BEZIER_APPROXIMATION_RESOLUTION = 10 // Number of segments to create when approximating a cubic bezier segment

export interface vec2 {
  x: number;
  y: number;
}

export interface vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export class BezierPoint {
  anchor: vec2;
  h1: vec2;
  h2: vec2;
}

export interface SVGCurve {
  type: string;
  x1, y1, x2, y2: number;
}

export interface SVGPoint {
  curve?: SVGCurve;
  moveTo?: boolean;
  closed?: boolean;
  x: number;
  y: number;
}

export const bezierCubic = (a: vec2, h1: vec2, h2: vec2, b: vec2, t: number): vec2 => {
	const t2 = t*t;
	const t3 = t2*t;
	const mt = 1-t;
	const mt2 = mt*mt;
	const mt3 = mt2*mt;
	return {
		x: a.x * mt3  +  3 * h1.x * mt2 * t  +  3 * h2.x * mt * t2  +  b.x * t3,
		y: a.y * mt3  +  3 * h1.y * mt2 * t  +  3 * h2.y * mt * t2  +  b.y * t3
	};
}

export class BezierPath {
  points: BezierPoint[] = [];
  closed: boolean = false;
  
  toApproximatedPolygon(resolution: number = CUBIC_BEZIER_APPROXIMATION_RESOLUTION): vec2[] {
    const out: vec2[] = []
    for(let i = 0; i < this.points.length; i++) {
      let nextIndex = i+1
      if(nextIndex == this.points.length) nextIndex = 0
      if(this.points[i].h2 || this.points[nextIndex].h1) {
        const h1 = this.points[i].h2 || this.points[i].anchor
        const h2 = this.points[nextIndex].h1 || this.points[nextIndex].anchor
        for(let t = 0; t < resolution; t++) {
          out.push(bezierCubic(this.points[i].anchor, h1, h2, this.points[nextIndex].anchor, 1 / t))
        }
      } else {
        out.push(this.points[i].anchor)
      }
    }
    
    return out;
  }
  
  splitSegment(pt1Index: number, pt2Index: number, t: number) {
    const newPts = cubicBezierSplit(
      t,
      this.points[pt1Index].anchor,
      this.points[pt1Index].h2,
      this.points[pt2Index].h1,
      this.points[pt2Index].anchor
    );
    
    this.points[pt1Index].h2 = newPts[0][1];
    this.points[pt2Index].h1 = newPts[1][2];
    
    const newPt = new BezierPoint();
    newPt.anchor = newPts[0][3];
    newPt.h1 = newPts[0][2];
    newPt.h2 = newPts[1][1];
    
    this.points.splice(pt2Index, 0, newPt);
  }
  
  static fromSVGPoints(points: SVGPoint[]): BezierPath[] {
    const paths = []
    
    let curPath: BezierPath = null
    let backPoint = null
    
    for(let i = 0; i < points.length; i++) {
      if(!curPath) curPath = new BezierPath()
      
      const newPoint = new BezierPoint()
      newPoint.anchor = points[i]
      if(i < points.length-1 && points[i+1].curve) {
        newPoint.h2 = {x: points[i+1].curve.x1, y: points[i+1].curve.y1}
      } else {
        newPoint.h2 = null
      }
      if(points[i].curve) {
        newPoint.h1 = {x: points[i].curve.x2, y: points[i].curve.y2}
      } else {
        newPoint.h1 = null
      }
      curPath.points.push(newPoint)
      
      if(points[i].closed) {
        curPath.closed = true
        paths.push(curPath)
        curPath = null
        i++; // ignore the final point after closing, it's a duplicate of the first point
      }
      
    }
    
    if(curPath) paths.push(curPath)
    return paths
  }
  
  static toSVGPoints(paths: BezierPath[]): SVGPoint[] {
    const out = [];
    // debugger;
    
    for(let i = 0; i < paths.length; i++) {
      for(let j = 0; j < paths[i].points.length; j++) {
        const pt: SVGPoint = {
          moveTo: j == 0 ? true : undefined,
          closed: paths[i].closed && j == paths[i].points.length-1 ? true : undefined,
          x: paths[i].points[j].anchor.x,
          y: paths[i].points[j].anchor.y,
        };
        
        if(j != 0 && j < paths[i].points.length-1 && paths[i].points[j].h2 && paths[i].points[j+1].h1) {
          pt.curve = {
            type: 'cubic',
            x1: paths[i].points[j].h2.x,
            y1: paths[i].points[j].h2.y,
            x2: paths[i].points[j+1].h1.x,
            y2: paths[i].points[j+1].h1.y,
          };
        } 
        out.push(pt);
      }
    }
    
    return out;
  }
}

export const pointInsideRect = (pt: vec2, corner1: vec2, corner2: vec2): boolean => {
  let c1 = {x: 0, y: 0}
  let c2 = {x: 0, y: 0}
  c1.x = Math.min(corner1.x, corner2.x)
  c1.y = Math.min(corner1.y, corner2.y)
  c2.x = Math.max(corner1.x, corner2.x)
  c2.y = Math.max(corner1.y, corner2.y)
  return pt.x >= c1.x && pt.x <= c2.x && pt.y >= c1.y && pt.y <= c2.y
}

export const distance = (a: vec2, b: vec2): number => {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
}

const evenOddRaycastPointInPolygon = (points: vec2[], test: vec2): boolean => {
  let intersections = 0
  let j
  for(let i = 0; i < points.length; i++) {
    if(i == 0) j = points.length - 1
    else j = i - 1
    
    if ((points[i].y > test.y) != (points[j].y > test.y) &&
      (test.x < (points[j].x - points[i].x) * (test.y - points[i].y) / (points[j].y - points[i].y) + points[i].x)) intersections++
  }
  
  return intersections % 2 == 1
}

const vec2Add = (a: vec2, b: vec2): vec2 => {
  return {x: a.x + b.x, y: a.y + b.y}
}
const vec2Sub = (a: vec2, b: vec2): vec2 => {
  return {x: a.x - b.x, y: a.y - b.y}
}
const vec2Mul = (a: vec2, b: vec2): vec2 => {
  return {x: a.x * b.x, y: a.y * b.y}
}
const vec2MulScalar = (a: vec2, n: number): vec2 => {
  return {x: a.x * n, y: a.y * n}
}
const vec2Div = (a: vec2, b: vec2): vec2 => {
  return {x: a.x / b.x, y: a.y / b.y}
}
const vec2DivScalar = (a: vec2, n: number): vec2 => {
  return {x: a.x / n, y: a.y / n}
}
const vec2Dot = (a: vec2, b: vec2): number => {
  return a.x * b.x + a.y * b.y
}
const vec2Mag = (a: vec2): number => {
  return Math.sqrt(a.x*a.x + a.y*a.y)
}
const vec2Normalize = (a: vec2): vec2 => {
  const mag = vec2Mag(a)
  if(mag) {
    return vec2DivScalar(a, mag)
  }
  return a
}

export const closestNormalPointOnLineSegment = (a: vec2, b: vec2, test: vec2): vec2 => {
  const at = vec2Sub(test, a)
  const ab = vec2Normalize(vec2Sub(b, a))
  let normalPoint = vec2Add(a, vec2MulScalar(ab, vec2Dot(at, ab)))
  
  // constrain to the line segement
  if(normalPoint.x < Math.min(a.x, b.x) || normalPoint.x > Math.max(a.x, b.x) || normalPoint.y < Math.min(a.y, b.y) || normalPoint.y > Math.max(a.y, b.y)) {
    normalPoint = b
  }
  
  return normalPoint
}

export const pointOnLineSegment = (a: vec2, b: vec2, test: vec2): boolean => {
  return distance(closestNormalPointOnLineSegment(a, b, test), test) <= LINE_SELECTION_THRESHOLD
}

export const pointOnPolyLineSegment = (points: vec2[], test: vec2): boolean => {
  for(let i = 1; i < points.length; i++) {
    if(pointOnLineSegment(points[i-1], points[i], test)) return true
  }
  return false
}

export const transform2DPoint = (point: vec2, ancestryMatrices: any[]): vec2 => {
  const offset = Layout3D.multiplyArrayOfMatrices(ancestryMatrices)
  const invertedOffset = createMatrix(); invertMatrix(invertedOffset, offset)
  const p = [point.x, point.y, 0, 1];
  return {
    x: invertedOffset[0] * p[0] + invertedOffset[4] * p[1] + invertedOffset[8] * p[2] + invertedOffset[12] * p[3],
    y: invertedOffset[1] * p[0] + invertedOffset[5] * p[1] + invertedOffset[9] * p[2] + invertedOffset[13] * p[3]
  };
}

export const isPointInsidePrimitive = (element: HaikuElement, point: vec2): boolean => {
  
  const original = element;
  if(element.type == 'use') {
    element = element.getTranscludedElement();
  }
  
  const correctedPoint = transform2DPoint(point, original.layoutAncestryMatrices.reverse())
  
  switch(element.type) {
    case 'rect':
      if(
          correctedPoint.x >= Number(element.attributes.x) &&
          correctedPoint.x <= Number(element.attributes.x) + element.sizeX &&
          correctedPoint.y >= Number(element.attributes.y) &&
          correctedPoint.y <= Number(element.attributes.y) + element.sizeY
        ) return true
      return false
      
    case 'circle':
      if(distance(correctedPoint, {x: Number(element.attributes.cx), y: Number(element.attributes.cy) }) <= Number(element.attributes.r)) return true
      return false
    
    case 'ellipse':
      if(
        Math.pow(correctedPoint.x - Number(element.attributes.cx), 2) / Math.pow(Number(element.attributes.rx), 2) +
        Math.pow(correctedPoint.y - Number(element.attributes.cy), 2) / Math.pow(Number(element.attributes.ry), 2)
        <= 1
      ) return true
      return false
    
    case 'line':
      return pointOnLineSegment({x: Number(element.attributes.x1), y: Number(element.attributes.y1)}, {x: Number(element.attributes.x2), y: Number(element.attributes.y2)}, correctedPoint)
    
    case 'polyline': {
      const polyPoints = SVGPoints.polyPointsStringToPoints(element.attributes.points).map((pt) => ({x: pt[0], y: pt[1]}))
      return pointOnPolyLineSegment(polyPoints, correctedPoint)
    }
    case 'polygon': {
      const polyPoints = SVGPoints.polyPointsStringToPoints(element.attributes.points).map((pt) => ({x: pt[0], y: pt[1]}))
      return evenOddRaycastPointInPolygon(polyPoints, correctedPoint)
    }
    
    case 'path': {
      // Build a straight-line approximation of the path and use the same algorithm as polygon
      const beziers = BezierPath.fromSVGPoints(SVGPoints.pathToPoints(element.attributes.d))
      for(let i = 0; i < beziers.length; i++) {
        if(beziers[i].closed && evenOddRaycastPointInPolygon(beziers[i].toApproximatedPolygon(), correctedPoint)) return true
        else if(pointOnPolyLineSegment(beziers[i].toApproximatedPolygon(), correctedPoint)) return true
      }
      return false
    }
  }
  
  return false
}

const mat4_multiply_vec4 = (m: number[], v: vec4): vec4 => {
  return {
    x: v.x*m[0] + v.x*m[1] + v.x*m[2] + v.x*m[3],
    y: v.y*m[4] + v.y*m[5] + v.y*m[6] + v.y*m[7],
    z: v.z*m[8] + v.z*m[9] + v.z*m[10] + v.z*m[11],
    w: v.w*m[12] + v.w*m[13] + v.w*m[14] + v.w*m[15]
  };
}

// NOTE: See Bezier curve splitting here: https://pomax.github.io/bezierinfo/#matrixsplit
export const cubicBezierSplit = (t: number, anchor1: vec2, handle1: vec2, handle2: vec2, anchor2: vec2): [[vec2,vec2,vec2,vec2],[vec2,vec2,vec2,vec2]] => {
  const cubicSegmentMatrix1 = [
    1,                 0,                    0,             0,
    -(t-1),            t,                    0,             0,
    Math.pow(t-1, 2)   -2*t*(t-1),           t*t,           0,
    -Math.pow(t-1, 3), 3*t*Math.pow(t-1, 2), -3*t*t*(t-1),  t*t*t
  ];
  const x1 = mat4_multiply_vec4(cubicSegmentMatrix1, {x: anchor1.x, y: handle1.x, z: handle2.x, w: anchor2.x});
  const y1 = mat4_multiply_vec4(cubicSegmentMatrix1, {x: anchor1.y, y: handle1.y, z: handle2.y, w: anchor2.y});
  
  const cubicSegmentMatrix2 = [
    -Math.pow(t-1, 3), 3*t*Math.pow(t-1, 2), -3*t*t*Math.pow(t-1, 3), t*t*t,
    0,                 Math.pow(t-1, 2),     -2*t*(t-1),              t*t,
    0,                 0,                    -(t-1),                  t,
    0,                 0,                    0,                       1
  ];
  const x2 = mat4_multiply_vec4(cubicSegmentMatrix2, {x: anchor1.x, y: handle1.x, z: handle2.x, w: anchor2.x});
  const y2 = mat4_multiply_vec4(cubicSegmentMatrix2, {x: anchor1.y, y: handle1.y, z: handle2.y, w: anchor2.y});
  
  return [
    [{x: x1.x, y: y1.x}, {x: x1.y, y: y1.y}, {x: x1.z, y: y1.z}, {x: x1.w, y: y1.w}],
    [{x: x2.x, y: y2.x}, {x: x2.y, y: y2.y}, {x: x2.z, y: y2.z}, {x: x2.w, y: y2.w}]
  ];
};

export default { isPointInsidePrimitive, distance, transform2DPoint, closestNormalPointOnLineSegment, LINE_SELECTION_THRESHOLD, BezierPath };