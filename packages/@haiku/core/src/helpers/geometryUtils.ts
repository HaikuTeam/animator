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

export interface vec2 {
  x: number;
  y: number;
}

class BezierPoint {
  anchor: vec2;
  h1: vec2 = {x:0,y:0};
  h2: vec2 = {x:0,y:0};
}

interface SVGCurve {
  type: string;
  x1, y1, x2, y2: number;
}

interface SVGPoint {
  curve?: SVGCurve;
  moveTo?: boolean;
  closed?: boolean;
  x: number;
  y: number;
}

class BezierPath {
  points: BezierPoint[] = [];
  
  static fromSVGPoints(points: SVGPoint[]): BezierPath[] {
    const paths = []
    
    let curPath: BezierPath = null
    let cursor: vec2 = {x: 0, y: 0}
    let backPoint = null
    
    for(let i = 0; i < points.length; i++) {
      if(!curPath) curPath = new BezierPath()
      
      if(points[i].moveTo) {
        cursor = points[i]
        continue
      }
      
      //TODO: Defines next two points...
      const newPoint = new BezierPoint()
      newPoint.anchor = cursor
      if(points[i].curve) {
        newPoint.h1 = {x: points[i].curve.x1, y: points[i].curve.y1}
        newPoint.h2 = {x: points[i].curve.x2, y: points[i].curve.y2}
        newPoint
      } else {
        newPoint.h1 = newPoint.anchor
        newPoint.h2 = newPoint.anchor
      }
      curPath.points.push(newPoint)
      
      if(points[i].closed) {
        paths.push(curPath)
        curPath = null
      }
      
    }
    
    if(curPath) paths.push(curPath)
    return paths
  }
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

const pointOnLineSegment = (a: vec2, b: vec2, test: vec2): boolean => {
    const at = vec2Sub(test, a)
    const ab = vec2Normalize(vec2Sub(b, a))
    let normalPoint = vec2Add(a, vec2MulScalar(ab, vec2Dot(at, ab)))
    
    // constrain to the line segement
    if(normalPoint.x < Math.min(a.x, b.x) || normalPoint.x > Math.max(a.x, b.x) || normalPoint.y < Math.min(a.y, b.y) || normalPoint.y > Math.max(a.y, b.y)) {
      normalPoint = b
    }
    return distance(normalPoint, test) <= LINE_SELECTION_THRESHOLD
}

export const isPointInsidePrimitive = (element: HaikuElement, point: vec2): boolean => {
  
  let type = element.type
  const original = element;
  if(element.type == 'use') {
    element = element.getTranscludedElement();
  }
  
  const offset = Layout3D.multiplyArrayOfMatrices(original.layoutAncestryMatrices.reverse())
  const invertedOffset = createMatrix(); invertMatrix(invertedOffset, offset)
  const p = [point.x, point.y, 0, 1];
  const correctedPoint = {
    x: invertedOffset[0] * p[0] + invertedOffset[4] * p[1] + invertedOffset[8] * p[2] + invertedOffset[12] * p[3],
    y: invertedOffset[1] * p[0] + invertedOffset[5] * p[1] + invertedOffset[9] * p[2] + invertedOffset[13] * p[3]
  };
  
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
      for(let i = 1; i < polyPoints.length; i++) {
        if(pointOnLineSegment(polyPoints[i-1], polyPoints[i], correctedPoint)) return true
      }
      return false
      
    }
    case 'polygon': {
      const polyPoints = SVGPoints.polyPointsStringToPoints(element.attributes.points).map((pt) => ({x: pt[0], y: pt[1]}))
      return evenOddRaycastPointInPolygon(polyPoints, correctedPoint)
    }
    
    case 'path': {
      // Build a straight-line approximation of the path and use the same algorithm as polygon
      const pathPoints = SVGPoints.pathToPoints(element.attributes.d)
      // console.log(pathPoints)
      return false
    //   const polyPoints = []
    //   for(let i = 0; i < pathPoints.length; i++) {
    
    //   }
    //   return evenOddRaycastPointInPolygon(polyPoints, correctedPoint)
    }
  }
  
  return false
}

export default { isPointInsidePrimitive, distance };