/* tslint:disable:max-line-length */

import {CurveSpec} from '@haiku/core/src/vendor/svg-points/types';
import {normalizePath, reverseNormalizedPath} from '../vendor/svg-path-reversal/SVGPathReversal';
import SVGPoints from './SVGPoints';

export interface Vec2 {
  x: number;
  y: number;
}

export interface Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export const splitSegmentInSVGPoints = (points: CurveSpec[], pt1Index: number, pt2Index: number, t: number): void => {
  // tslint:disable-next-line
  if (pt2Index === points.length) { pt2Index = 0; }

  let h1: Vec2;
  let h2: Vec2;
  if (points[pt2Index].curve) {
    h1 = {x: points[pt2Index].curve.x1, y: points[pt2Index].curve.y1};
    h2 = {x: points[pt2Index].curve.x2, y: points[pt2Index].curve.y2};
  } else {
    h1 = points[pt1Index];
    h2 = points[pt2Index];
  }

  const newPts = cubicBezierSplit(
    t,
    points[pt1Index],
    h1,
    h2,
    points[pt2Index],
  );

  if (points[pt2Index].curve) {
    points[pt2Index].curve.x1 = newPts[1][1].x;
    points[pt2Index].curve.y1 = newPts[1][1].y;
    points[pt2Index].curve.x2 = newPts[1][2].x;
    points[pt2Index].curve.y2 = newPts[1][2].y;
  }

  let newCurve = null;
  if (points[pt2Index].curve) {
    newCurve = {
      type: 'cubic',
      x1: newPts[0][1].x,
      y1: newPts[0][1].y,
      x2: newPts[0][2].x,
      y2: newPts[0][2].y,
    };
  }
  const newPoint = {
    x: newPts[0][3].x,
    y: newPts[0][3].y,
    curve: newCurve,
  };

  points.splice(pt2Index, 0, newPoint);
};

// NOTE: See Bezier curve splitting here: https://pomax.github.io/bezierinfo/#matrixsplit
export const cubicBezierSplit = (t: number, anchor1: Vec2, handle1: Vec2, handle2: Vec2, anchor2: Vec2): [[Vec2, Vec2, Vec2, Vec2], [Vec2, Vec2, Vec2, Vec2]] => {
  const cubicSegmentMatrix1 = [
    1,
    0,
    0,
    0,
    -(t - 1),
    t,
    0,
    0,
    Math.pow(t - 1, 2),
    -2 * t * (t - 1),
    t * t,
    0,
    -Math.pow(t - 1, 3),
    3 * t * Math.pow(t - 1, 2),
    -3 * t * t * (t - 1),
    t * t * t,
  ];
  const x1 = mat4_multiply_vec4(cubicSegmentMatrix1, {x: anchor1.x, y: handle1.x, z: handle2.x, w: anchor2.x});
  const y1 = mat4_multiply_vec4(cubicSegmentMatrix1, {x: anchor1.y, y: handle1.y, z: handle2.y, w: anchor2.y});

  const cubicSegmentMatrix2 = [
    -Math.pow(t - 1, 3),
    3 * t * Math.pow(t - 1, 2),
    -3 * t * t * (t - 1),
    t * t * t,
    0,
    Math.pow(t - 1, 2),
    -2 * t * (t - 1),
    t * t,
    0,
    0,
    -(t - 1),
    t,
    0,
    0,
    0,
    1,
  ];
  const x2 = mat4_multiply_vec4(cubicSegmentMatrix2, {x: anchor1.x, y: handle1.x, z: handle2.x, w: anchor2.x});
  const y2 = mat4_multiply_vec4(cubicSegmentMatrix2, {x: anchor1.y, y: handle1.y, z: handle2.y, w: anchor2.y});

  return [
    [{x: x1.x, y: y1.x}, {x: x1.y, y: y1.y}, {x: x1.z, y: y1.z}, {x: x1.w, y: y1.w}],
    [{x: x2.x, y: y2.x}, {x: x2.y, y: y2.y}, {x: x2.z, y: y2.z}, {x: x2.w, y: y2.w}],
  ];
};

export const distance = (a: Vec2, b: Vec2): number => {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
};

// tslint:disable-next-line:variable-name
export const mat4_multiply_vec4 = (m: number[], v: Vec4): Vec4 => {
  return {
    x: v.x * m[0] + v.y * m[1] + v.z * m[2] + v.w * m[3],
    y: v.x * m[4] + v.y * m[5] + v.z * m[6] + v.w * m[7],
    z: v.x * m[8] + v.y * m[9] + v.z * m[10] + v.w * m[11],
    w: v.x * m[12] + v.y * m[13] + v.z * m[14] + v.w * m[15],
  };
};

export const polygonArea = (points: Vec2[]): number => {
  let area = 0;
  let a: Vec2;
  let b: Vec2 = points[points.length - 1];
  for (let i = 0; i < points.length; i++) {
    a = b;
    b = points[i];
    area += a.y * b.x - a.x * b.y;
  }
  return area / 2;
};

export const polygonLength = (points: Vec2[]): number => {
  let perimeter = 0;
  let a: Vec2;
  let b: Vec2 = points[points.length - 1];
  for (let i = 0; i < points.length; i++) {
    a = b;
    b = points[i];
    perimeter += distance(a, b);
  }
  return perimeter;
};

export const distributeTotalVertices = (path: CurveSpec[], totalVertices: number): void => {
  const pointsToAdd = totalVertices - path.length;
  if (pointsToAdd <= 0) {
    return;
  }

  interface Segment {
    index: number;
    length: number;
    splits: number;
  }

  // Find the length of every segment (approximate)
  // NOTE: This computes distance across the vertices, not along the actual bezier curve.
  // A possible improvement would be finding true distance along the curve, but at a much
  // higher computational cost.
  const segments: Segment[] = [];
  for (let i = 0; i < path.length; i++) {
    segments.push({
      index: i,
      length: distance(path[i], path[(i + 1) % path.length]),
      splits: 0,
    });
  }

  let addedPoints = 0;
  while (addedPoints < pointsToAdd) {
    // Sort by length, accounting for number of splits
    segments.sort((a, b) => (a.length / (a.splits || 1) - b.length / (b.splits || 1)));
    // Split the longest segment again
    segments[segments.length - 1].splits++;
    addedPoints++;
  }

  // Apply the splits
  segments.sort((a, b) => (a.index - b.index));
  let inserted = 0;
  for (let i = 0; i < segments.length; i++) {
    while (segments[i].splits > 0) {
      // NOTE: This splits at linear values for t
      // A possible improvement would be finding truly equidistant points along the curve
      // at much higher computational cost.
      splitSegmentInSVGPoints(path, i + inserted, (i + inserted + 1) % path.length, 1 / (segments[i].splits + 1));

      inserted++;
      segments[i].splits--;
    }
  }
};

export const rotatePathForSmallestDistance = (source: CurveSpec[], dest: CurveSpec[]): void => {
  if (source.length !== dest.length) {
    throw new Error('Mismatched source and destination length.');
  }

  let moveToPopped = false;
  if (source[0].moveTo && dest[0].moveTo) {
    source.shift();
    dest.shift();
    moveToPopped = true;
  }
  let smallestOffset = 0;
  let minDistance = Infinity;

  for (let rotationOffset = 0; rotationOffset < source.length; rotationOffset++) {
    let distanceSum = 0;
    for (let i = 0; i < source.length; i++) {
      const dist = distance(source[i], dest[(rotationOffset + i) % dest.length]);
      distanceSum += dist;
    }

    if (distanceSum < minDistance) {
      minDistance = distanceSum;
      smallestOffset = rotationOffset;
    }
  }

  if (smallestOffset === 0) {
    return;
  }

  const closed = dest[dest.length - 1].closed;
  const spliced = dest.splice(0, smallestOffset);
  dest.splice(source.length, 0, ...spliced);

  // Clean up
  if (closed) {
    dest[dest.length - 1].closed = true;
  }
  if (moveToPopped) {
    source.unshift({
      x: source[source.length - 1].x,
      y: source[source.length - 1].y,
      moveTo: true,
    });
    dest.unshift({
      x: dest[dest.length - 1].x,
      y: dest[dest.length - 1].y,
      moveTo: true,
    });
  }
  for (let i = 0; i < dest.length; i++) {
    if (i < dest.length - 1 && dest[i].closed) {
      delete dest[i].closed;
    }
    if (i > 0 && dest[i].moveTo) {
      delete dest[i].moveTo;
    }
  }
};

export const ensurePathClockwise = (path: CurveSpec[]): void => {
  if (polygonArea(path) > 0) {
    const reversed = reverseNormalizedPath(normalizePath(SVGPoints.pointsToPath(path)));
    path.splice(0, path.length);
    const reversedPoints = SVGPoints.pathToPoints(reversed);
    for (let i = 0; i < reversedPoints.length; i++) {
      path.push(reversedPoints[i]);
    }
  }
};

export const normalizePointCurves = (path: CurveSpec[]): void => {
  for (let i = 1; i < path.length; i++) {
    if (path[i].curve) {
      // TODO: Convert A and Q curves to cubic bezier
      continue;
    }

    path[i].curve = {
      type: 'cubic',
      x1: path[i - 1].x,
      y1: path[i - 1].y,
      x2: path[i].x,
      y2: path[i].y,
    };
  }
};

export default {
  ensurePathClockwise,
  distributeTotalVertices,
  rotatePathForSmallestDistance,
  normalizePointCurves,
};
