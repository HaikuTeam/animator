/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import HaikuElement from '@haiku/core/lib/HaikuElement';
import {distance, Vec2} from '@haiku/core/lib/helpers/PathUtil';
import SVGPoints from '@haiku/core/lib/helpers/SVGPoints';
import Layout3D from '@haiku/core/lib/Layout3D';
import create from '@haiku/core/lib/vendor/gl-mat4/create';
import invert from '@haiku/core/lib/vendor/gl-mat4/invert';
import {CurveSpec} from '@haiku/core/lib/vendor/svg-points/types';

// Number of pixels allowance for a line to be selected
export const DEFAULT_LINE_SELECTION_THRESHOLD = 5;
// Number of segments to create when approximating a cubic bezier segment
export const CUBIC_BEZIER_APPROXIMATION_RESOLUTION = 80;

export const bezierCubic = (a: Vec2, h1: Vec2, h2: Vec2, b: Vec2, t: number): Vec2 => {
  const t2 = t * t;
  const t3 = t2 * t;
  const mt = 1 - t;
  const mt2 = mt * mt;
  const mt3 = mt2 * mt;
  return {
    x: a.x * mt3 + 3 * h1.x * mt2 * t + 3 * h2.x * mt * t2 + b.x * t3,
    y: a.y * mt3 + 3 * h1.y * mt2 * t + 3 * h2.y * mt * t2 + b.y * t3,
  };
};

export const buildPathLUT = (
  points: CurveSpec[],
  segmentResolution: number = CUBIC_BEZIER_APPROXIMATION_RESOLUTION,
): [Vec2[], boolean] => {
  const out = [];
  for (let i = 0; i < points.length; i++) {
    if (points[i].moveTo) {
      continue;
    } // TODO: Assert that points[0] is moveTo?
    if (points[i].curve) {
      for (let t = 0; t < 1; t += 1 / segmentResolution) {
        out.push(bezierCubic(
          points[i - 1],
          {x: points[i].curve.x1, y: points[i].curve.y1},
          {x: points[i].curve.x2, y: points[i].curve.y2},
          points[i],
          t));
      }
    } else {
      // Linear interpolation
      for (let t = 0; t < 1; t += 1 / segmentResolution) {
        out.push({
          x: (points[i].x - points[i - 1].x) * t + points[i - 1].x,
          y: (points[i].y - points[i - 1].y) * t + points[i - 1].y,
        });
      }
    }
  }

  return [out, points[points.length - 1].closed || points[points.length - 2].closed];
};

export const pointInsideRect = (pt: Vec2, corner1: Vec2, corner2: Vec2): boolean => {
  const c1 = {x: 0, y: 0};
  const c2 = {x: 0, y: 0};
  c1.x = Math.min(corner1.x, corner2.x);
  c1.y = Math.min(corner1.y, corner2.y);
  c2.x = Math.max(corner1.x, corner2.x);
  c2.y = Math.max(corner1.y, corner2.y);
  return pt.x >= c1.x && pt.x <= c2.x && pt.y >= c1.y && pt.y <= c2.y;
};

const evenOddRaycastPointInPolygon = (points: Vec2[], test: Vec2): boolean => {
  let intersections = 0;
  let j;
  for (let i = 0; i < points.length; i++) {
    if (i === 0) {
      j = points.length - 1;
    } else {
      j = i - 1;
    }

    if ((points[i].y > test.y) !== (points[j].y > test.y) &&
      (test.x < (points[j].x - points[i].x) * (test.y - points[i].y) / (points[j].y - points[i].y) + points[i].x)) {
      intersections++;
    }
  }

  return intersections % 2 === 1;
};

const vec2Add = (a: Vec2, b: Vec2): Vec2 => {
  return {x: a.x + b.x, y: a.y + b.y};
};

const vec2Sub = (a: Vec2, b: Vec2): Vec2 => {
  return {x: a.x - b.x, y: a.y - b.y};
};

const vec2MulScalar = (a: Vec2, n: number): Vec2 => {
  return {x: a.x * n, y: a.y * n};
};

const vec2DivScalar = (a: Vec2, n: number): Vec2 => {
  return {x: a.x / n, y: a.y / n};
};

const vec2Dot = (a: Vec2, b: Vec2): number => {
  return a.x * b.x + a.y * b.y;
};

const vec2Mag = (a: Vec2): number => {
  return Math.sqrt(a.x * a.x + a.y * a.y);
};

const vec2Normalize = (a: Vec2): Vec2 => {
  const mag = vec2Mag(a);
  if (mag) {
    return vec2DivScalar(a, mag);
  }
  return a;
};

export const closestNormalPointOnLineSegment = (a: Vec2, b: Vec2, test: Vec2): Vec2 => {
  const at = vec2Sub(test, a);
  const ab = vec2Normalize(vec2Sub(b, a));
  let normalPoint = vec2Add(a, vec2MulScalar(ab, vec2Dot(at, ab)));

  // constrain to the line segement
  if (
    normalPoint.x < Math.min(a.x, b.x) ||
    normalPoint.x > Math.max(a.x, b.x) ||
    normalPoint.y < Math.min(a.y, b.y) ||
    normalPoint.y > Math.max(a.y, b.y)
  ) {
    normalPoint = b;
  }

  return normalPoint;
};

export const pointOnLineSegment = (
  a: Vec2, b: Vec2, test: Vec2,
  threshold: number = DEFAULT_LINE_SELECTION_THRESHOLD): boolean => {
  return distance(closestNormalPointOnLineSegment(a, b, test), test) <= threshold;
};

export const pointOnPolyLineSegment = (
  points: Vec2[], test: Vec2,
  threshold: number = DEFAULT_LINE_SELECTION_THRESHOLD): boolean => {
  for (let i = 1; i < points.length; i++) {
    if (pointOnLineSegment(points[i - 1], points[i], test, threshold)) {
      return true;
    }
  }
  return false;
};

export const transform2DPoint = (point: Vec2, ancestryMatrices: any[]): Vec2 => {
  const offset = Layout3D.multiplyArrayOfMatrices(ancestryMatrices);
  const invertedOffset = create(); invert(invertedOffset, offset);
  const p = [point.x, point.y, 0, 1];
  return {
    x: invertedOffset[0] * p[0] + invertedOffset[4] * p[1] + invertedOffset[8] * p[2] + invertedOffset[12] * p[3],
    y: invertedOffset[1] * p[0] + invertedOffset[5] * p[1] + invertedOffset[9] * p[2] + invertedOffset[13] * p[3],
  };
};

export const isPointAlongStroke = (element: HaikuElement, point: Vec2,
                                   threshold: number = DEFAULT_LINE_SELECTION_THRESHOLD): boolean => {

  const original = element;
  if (element.type === 'use') {
    // tslint:disable-next-line
    element = element.getTranscludedElement();
  }

  if (isNaN(threshold) || threshold < DEFAULT_LINE_SELECTION_THRESHOLD) {
    // tslint:disable-next-line
    threshold = DEFAULT_LINE_SELECTION_THRESHOLD;
  }

  const correctedPoint = transform2DPoint(point, original.layoutAncestryMatrices.reverse());

  switch (element.type) {
    case 'rect': {
      const p1 = {x: Number(element.attributes.x), y: Number(element.attributes.y)};
      const p2 = {x: Number(element.attributes.x) + element.sizeX, y: Number(element.attributes.y)};
      const p3 = {x: Number(element.attributes.x) + element.sizeX, y: Number(element.attributes.y) + element.sizeY};
      const p4 = {x: Number(element.attributes.x), y: Number(element.attributes.y) + element.sizeY};
      return (
        pointOnLineSegment(p1, p2, correctedPoint, threshold) ||
        pointOnLineSegment(p2, p3, correctedPoint, threshold) ||
        pointOnLineSegment(p3, p4, correctedPoint, threshold) ||
        pointOnLineSegment(p4, p1, correctedPoint, threshold)
      );
    }
    case 'circle': {
      const dist = distance(correctedPoint, {x: Number(element.attributes.cx), y: Number(element.attributes.cy)});
      const radius = Number(element.attributes.r);
      return dist <= radius + threshold / 2 && dist >= radius - threshold / 2;
    }
    case 'ellipse': {
      const a =
        Math.pow(correctedPoint.x - Number(element.attributes.cx), 2) / Math.pow(Number(element.attributes.rx), 2) +
        Math.pow(correctedPoint.y - Number(element.attributes.cy), 2) / Math.pow(Number(element.attributes.ry), 2);
      return 0.9 < a && a < 1.1; // TODO: Some actually good math here! Need to take stroke width into account
    }
    case 'line':
      return pointOnLineSegment(
        {x: Number(element.attributes.x1), y: Number(element.attributes.y1)},
        {x: Number(element.attributes.x2), y: Number(element.attributes.y2)},
        correctedPoint, threshold);

    case 'polygon':
    case 'polyline': {
      const polyPoints =
        SVGPoints.polyPointsStringToPoints(element.attributes.points).map((pt) => ({x: pt[0], y: pt[1]}));
      return pointOnPolyLineSegment(polyPoints, correctedPoint, threshold);
    }

    case 'path': {
      // Build a straight-line approximation of the path and use the same algorithm as polygon
      const [points, closed] = buildPathLUT(SVGPoints.pathToPoints(element.attributes.d));
      if (closed) {
        points.push(points[0]);
      }
      return pointOnPolyLineSegment(points, correctedPoint, threshold);
    }
  }

  return false;
};

export const isPointInsidePrimitive = (element: HaikuElement, point: Vec2): boolean => {

  const original = element;
  if (element.type === 'use') {
    // tslint:disable-next-line:no-parameter-reassignment
    element = element.getTranscludedElement();
  }

  const correctedPoint = transform2DPoint(point, original.layoutAncestryMatrices.reverse());

  switch (element.type) {
    case 'rect':
      return correctedPoint.x >= Number(element.attributes.x) && correctedPoint.x <= Number(element.attributes.x) +
        element.sizeX && correctedPoint.y >= Number(element.attributes.y) && correctedPoint.y <=
        Number(element.attributes.y) + element.sizeY;

    case 'circle':
      return distance(
        correctedPoint,
        {
          x: Number(element.attributes.cx),
          y: Number(element.attributes.cy),
        },
      ) <= Number(element.attributes.r);

    case 'ellipse':
      return Math.pow(correctedPoint.x - Number(element.attributes.cx), 2) / Math.pow(
        Number(element.attributes.rx),
        2,
      ) + Math.pow(correctedPoint.y - Number(element.attributes.cy), 2) / Math.pow(
        Number(element.attributes.ry),
        2,
      ) <= 1;

    case 'polygon':
      const polyPoints =
        SVGPoints.polyPointsStringToPoints(element.attributes.points).map((pt) => ({x: pt[0], y: pt[1]}));
      return evenOddRaycastPointInPolygon(polyPoints, correctedPoint);

    case 'path':
      // Build a straight-line approximation of the path and use the same algorithm as polygon
      const [points] = buildPathLUT(SVGPoints.pathToPoints(element.attributes.d));
      return evenOddRaycastPointInPolygon(points, correctedPoint);

    default:
      return false;
  }
};
