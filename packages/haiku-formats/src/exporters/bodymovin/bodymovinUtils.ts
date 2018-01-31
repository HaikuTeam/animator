import SVGPoints from '@haiku/core/lib/helpers/SVGPoints';
import {PathPoint} from 'haiku-common/lib/types';

import {
  AnimationKey,
  PathKey,
  PropertyKey,
  ShapeKey,
  ShapeType,
  TransformKey,
} from './bodymovinEnums';
import {
  BodymovinCoordinates,
  BodymovinPathComponent,
  BodymovinProperty,
} from './bodymovinTypes';

const {pathToPoints} = SVGPoints;

/**
 * Reducer for an animated timeline property.
 *
 * To achieve Bodymovin-compatible animated timeline properties, we have to merge all scalar values
 * sequentially. For example, the reduction of
 *
 * [
 *   {
 *     "a": 1,
 *     "k": [
 *       {
 *         "v": [0],
 *         "i": {"x": [.1], "y": [.3]},
 *         "o": {"x": [.5], "y": [.7]}
 *       }
 *     ]
 *   },
 *   {
 *     "a": 1,
 *     "k": [
 *       {
 *         "v": [1],
 *         "i": {"x": [.2], "y": [.4]},
 *         "o": {"x": [.6], "y": [.8]}
 *       }
 *     ]
 *   }
 * ]
 *
 * is
 *
 * {
 *   "a": 1,
 *   "k": [
 *     {
 *       "v": [0, 1],
 *       "i": {"x": [.1, .2], "y": [.3, .4]},
 *       "o": {"x": [.5, .6], "y": [.7, .8]}
 *     }
 *   ]
 * }
 * @param accumulator
 * @param currentValue
 * @returns {{}}
 * @private
 */
const animatedTimelineReducer = (accumulator, currentValue) => {
  if (Object.keys(accumulator).length === 0) {
    return currentValue;
  }

  currentValue[PropertyKey.Value].forEach((keyframe, index) => {
    if (accumulator[PropertyKey.Value][index][AnimationKey.Time] !== keyframe[AnimationKey.Time]) {
      // This should never happen! The work done in BodymovinExporter.alignCurveKeyframes() should guarantee keyframes
      // are aligned for values that are animated together.
      throw new Error('Encountered mismatched keyframe times in an animated timeline!');
    }

    if (index !== currentValue[PropertyKey.Value].length - 1) {
      accumulator[PropertyKey.Value][index][AnimationKey.Start].push(keyframe[AnimationKey.Start][0]);
      accumulator[PropertyKey.Value][index][AnimationKey.End].push(keyframe[AnimationKey.End][0]);
      accumulator[PropertyKey.Value][index][AnimationKey.BezierIn].x.push(keyframe[AnimationKey.BezierIn].x[0]);
      accumulator[PropertyKey.Value][index][AnimationKey.BezierIn].y.push(keyframe[AnimationKey.BezierIn].y[0]);
      accumulator[PropertyKey.Value][index][AnimationKey.BezierOut].x.push(keyframe[AnimationKey.BezierOut].x[0]);
      accumulator[PropertyKey.Value][index][AnimationKey.BezierOut].y.push(keyframe[AnimationKey.BezierOut].y[0]);
    }
  });

  return accumulator;
};

/**
 * Reducer for a compound timeline property.
 * @param accumulator
 * @param currentValue
 * @returns {{}}
 */
export const compoundTimelineReducer = (accumulator, currentValue) => {
  if (currentValue[PropertyKey.Animated] === 1) {
    return animatedTimelineReducer(accumulator, currentValue);
  }

  if (Object.keys(accumulator).length === 0) {
    return {
      ...currentValue, [PropertyKey.Value]: [currentValue[PropertyKey.Value]],
    };
  }

  return {
    ...accumulator, [PropertyKey.Value]: accumulator[PropertyKey.Value].concat(currentValue[PropertyKey.Value]),
  };
};

/**
 * Lazy getter for the Bodymovin version. Only called if the exporter is requested.
 */
export const getBodymovinVersion = () => require('../../../package.json').devDependencies.bodymovin;

/**
 * Produce a fixed property for a transform.
 * @param fixedValue
 * @returns BodymovinProperty
 */
export const getFixedPropertyValue = (fixedValue: any): BodymovinProperty => {
  return {
    [PropertyKey.Animated]: 0,
    [PropertyKey.Value]: fixedValue,
  } as BodymovinProperty;
};

/**
 * Forces a possibly scalar value to be an array.
 * @param maybeArray
 * @returns {any[]}
 */
export const alwaysArray = (maybeArray: any): any[] => {
  if (Array.isArray(maybeArray)) {
    return maybeArray;
  }

  return [maybeArray];
};

/**
 * Forces a possibly percent value to be an absolute value.
 *
 * We need this behavior a lot when dealing with paint server fills and strokes, since After Effects doesn't have a
 * concept of relative gradient stops.
 * @param {string | number} maybePercent
 * @param {number} basis
 * @returns {number}
 */
export const alwaysAbsolute = (maybePercent: string|number, basis: number): number => {
  if (typeof maybePercent === 'string' && /^\d*\.?\d+?%$/.test(maybePercent)) {
    return parseFloat(maybePercent.replace('%', '')) * basis / 100;
  }

  return Number(maybePercent);
};

/**
 * Gets the dimensions of a shape constructed during shape-parsing.
 * @param shape
 * @returns {[number , number]}
 */
export const getShapeDimensions = (shape: any): [number, number] => {
  switch (shape[ShapeKey.Type]) {
    case ShapeType.Rectangle:
    case ShapeType.Ellipse:
      return shape[TransformKey.Size][PropertyKey.Value];
    case ShapeType.Shape:
      if (!shape.hasOwnProperty(ShapeKey.Vertices)) {
        return [0, 0];
      }

      // Find the maximal X-vertex and the maximal Y-vertex. Note: this may fail to actually capture the bounding
      // box of all shapes. It is suitable for all polygons (convex and concave), but might miss e.g. an arc or bezier
      // curve whose path traces beyond the convex hull of the set of vertices. The upshot of missing this is
      // currently only that we might fail to perfectly render a gradient fill, so it's not the end of the world!
      const vertices = shape[ShapeKey.Vertices][PropertyKey.Value][PathKey.Points];
      return [
        Math.max(...vertices.map((vertex) => vertex[0])),
        Math.max(...vertices.map((vertex) => vertex[1])),
      ];
    default:
      throw new Error(`Invalid request to get dimensions for shape type: ${shape[ShapeKey.Type]}`);
  }
};

/**
 * Apply a mutator to a possibly-multidimensional property, if a mutator has been provided at all.
 * @param property
 * @param {(any) => any} mutator
 * @returns {any}
 */
export const maybeApplyMutatorToProperty = (property: any, mutator: (any) => any) => {
  if (mutator === undefined) {
    return property;
  }

  if (Array.isArray(property)) {
    return property.map(mutator);
  }

  return mutator(property);
};

/**
 * Translates interpolation points relative to their vertices.
 * @param points
 * @param vertices
 * @private
 */
const translateInterpolationPoints = (points: BodymovinPathComponent, vertices: BodymovinPathComponent) => {
  points.forEach((value, index) => {
    points[index] = [value[0] - vertices[index][0], value[1] - vertices[index][1]];
  });
};

/**
 * Translates an SVG path to a Bodymovin interpolation trace.
 * @param {string} path
 * @returns {[key in PathKey]: BodymovinPathComponent}
 */
export const pathToInterpolationTrace = (points: PathPoint[]) => {
  const vertices: BodymovinPathComponent = [];
  const interpolationInPoints: BodymovinPathComponent = [];
  const interpolationOutPoints: BodymovinPathComponent = [];

  let closed = true;

  // Force the last vertex to be the same as the first so we can use the same algorithm for closed and open paths.
  // The renderer will respect the value of "closed" we pass below.
  if (points.length > 1 &&
    (points[0].x !== points[points.length - 1].x || points[0].y !== points[points.length - 1].y)) {
    closed = false;
    points.push(points[0]);
  }

  let lastVertex;
  points.forEach((point, index) => {
    if (point.moveTo && index === 0) {
      // We are at a moveto. This pushes a new vertex onto our trace.
      vertices.push(lastVertex = [point.x, point.y] as BodymovinCoordinates);
    } else if (point.curve) {
      // TODO: Actually check the curve for validity (e.g. NaNs where NaNs are illegal).
      if (point.curve.type !== 'cubic') {
        // TODO: Support quadratic beziers and arcs.
        throw new Error(`Unsupported curve type: ${point.curve.type}!`);
      }
      interpolationOutPoints.push([point.curve.x1, point.curve.y1]); // This is the last out point.
      interpolationInPoints.push([point.curve.x2, point.curve.y2]); // This is the current in point.
      vertices.push(lastVertex = [point.x, point.y] as BodymovinCoordinates);
    } else {
      // We are at a lineto. This pushes a new vertex onto our trace and creates a "null interpolation".
      interpolationOutPoints.push(lastVertex);
      vertices.push(lastVertex = [point.x, point.y] as BodymovinCoordinates);
      interpolationInPoints.push(lastVertex);
    }
  });

  // We are at a closepath directive. We should now unshift the last in-point to the top of the stack and remove the
  // final vertex, which is a dupe. Note: when we add support for non-closed shapes, this will become much harder!
  if (vertices.length > 1) {
    interpolationInPoints.unshift(interpolationInPoints.pop());
    vertices.pop();
  } else if (vertices.length === 1) {
    interpolationInPoints.push(vertices[0]);
    interpolationOutPoints.push(vertices[0]);
  } else {
    // Nothing to really do here, since we have no vertices.
    return {};
  }

  // Translate all interpolation points relative to their corresponding vertices.
  translateInterpolationPoints(interpolationInPoints, vertices);
  translateInterpolationPoints(interpolationOutPoints, vertices);

  return {
    [PathKey.Closed]: closed,
    [PathKey.Points]: vertices,
    [PathKey.InterpolationIn]: interpolationInPoints,
    [PathKey.InterpolationOut]: interpolationOutPoints,
  };
};

/**
 * Translate SVG points to Bodymovin vertices.
 * @param {string} svgPoints
 * @returns {[key in PathKey]: BodymovinPathComponent}
 */
export const pointsToInterpolationTrace = (svgPoints: string) => {
  // Normalize "x1,y1 x2,y2" syntax to "x1 y1 x2 y2" syntax before splitting
  const points: number[] = svgPoints.replace(/,/g, ' ').split(' ').map(Number);
  const chunkedPoints = [];
  for (let i = 0; i < points.length; i += 2) {
    chunkedPoints.push(points.slice(i, i + 2));
  }

  // To support Bodymovin export format, we have to create a "dummy curve" with null interpolation points.
  // tslint:disable-next-line:prefer-array-literal
  const dummyCurve = new Array(chunkedPoints.length);
  dummyCurve.fill([0, 0]);
  return {
    [PathKey.Points]: chunkedPoints,
    [PathKey.InterpolationIn]: dummyCurve,
    [PathKey.InterpolationOut]: dummyCurve,
  };
};

/**
 * Private helper enum for decomposePath. Colinear orientation is elided for simplicity.
 */
enum Orientation {
  Clockwise = 0,
  Counterclockwise = 1,
}

/**
 * Private helper method for decomposePath. Given three PathPoints, determines their "close enough" orientation
 * (colinearity is cast to "CounterClockwise" without loss of effect).
 *
 * @see {@link https://www.geeksforgeeks.org/orientation-3-ordered-points/}
 * @param {PathPoint} p1
 * @param {PathPoint} p2
 * @param {PathPoint} p3
 * @returns {Orientation}
 */
const getOrientation = (p1: PathPoint, p2: PathPoint, p3: PathPoint): Orientation => {
  const orientationCoefficient = ((p2.y - p1.y) * (p3.x - p2.x) || 0) - ((p2.x - p1.x) * (p3.y - p2.y) || 0);
  return (orientationCoefficient > 0) ? Orientation.Clockwise : Orientation.Counterclockwise;
};

/**
 * Private helper method for decomposePath. Determines if a polygon nontrivially contains a point, which is used as
 * a rough proxy for whether we should detach or conjoin chained paths. Because we are only concerned with correct
 * rendering, we don't have use for a notion of "colinearity", which makes the work here slightly more efficient.
 *
 * We use a shoddy implementation of the "Ray casting algorithm", a standard test for polygonal "insideness": count the
 * number of times the ray from [p.x, p.y] to [+Infinity, p.y] intersects a side of the polygon. If odd, the point is
 * "inside"; else, the point is "outside".
 * @see {@link https://en.wikipedia.org/wiki/Point_in_polygon#Ray_casting_algorithm}
 * @param {PathPoint[]} polygon
 * @param {PathPoint} p
 * @returns {boolean}
 */
const polygonContainsPoint = (polygon: PathPoint[], p: PathPoint): boolean => {
  // Trivial case: a polygon with < 2 vertices is always safe to split off.
  if (polygon.length < 3) {
    return false;
  }

  const pInf = {x: Infinity, y: p.y} as PathPoint;

  let intersections = 0;
  let cursor = 0;

  while (cursor < polygon.length) {
    const [polygon1, polygon2] = (cursor === polygon.length - 1)
      ? [polygon[cursor], polygon[0]]
      : [polygon[cursor], polygon[cursor + 1]];
    cursor++;

    // Tests if the line segment <polygon1, polygon2> is intersected by the ray <p, pInf>.
    if (
      getOrientation(polygon1, polygon2, p) !== getOrientation(polygon1, polygon2, pInf)
      && getOrientation(p, pInf, polygon1) !== getOrientation(p, pInf, polygon2)
    ) {
      intersections++;
    }
  }

  return intersections % 2 === 1;
};

/**
 * Decomposes a path, which might be compound, into singly-closed paths which might not be contiguous.
 *
 * This is achieved by splitting the path into groups of closed paths, then applying a naive (but frequently correct)
 * algorithm that assumes if the first point of the next path we encounter is *outside* the polygon traced by the
 * vertices of the prior shape, we have jumped into a noncontiguous shape. In these scenarios, which are most common
 * in SVGs generated in Sketch, evenodd/nonzero fill rules do the same thing and.
 * @param {string} path
 * @returns {string[]}
 */
export const decomposePath = (path: string): PathPoint[][] => {
  const allClosedPaths = path.split(/z/ig).filter((segment) => !!segment).map(pathToPoints);
  const closureEndpoints: [number, number][] = [];
  let cursorIndex = 0;
  let enclosureIndex = undefined;
  let enclosure: PathPoint[] = [];
  if (allClosedPaths.length < 2) {
    return allClosedPaths;
  }

  while (cursorIndex < allClosedPaths.length) {
    // Check if the first point of the current path is contained within the current enclosure. (This is trivially
    // false for the first point of the first path.)
    const chosenPoint = allClosedPaths[cursorIndex][0];
    if (polygonContainsPoint(enclosure, chosenPoint)) {
      cursorIndex++;
      continue;
    }

    // We have started a new shape! Capture the union of the polygons from enclosureIndex->cursorIndex in
    // decomposed, then reset.
    if (enclosureIndex !== undefined) {
      closureEndpoints.push([enclosureIndex, cursorIndex]);
    }

    enclosure = allClosedPaths[cursorIndex];
    enclosureIndex = cursorIndex;
    cursorIndex++;
  }

  closureEndpoints.push([enclosureIndex, cursorIndex]);

  // We now have an array like [[0, 1], [1, 2], [2, 5]] of non-contiguous junctures in a compound path. As the final
  // step, collapse these into their final PathPoint[][] form.
  return closureEndpoints.map(
    ([start, end]) => allClosedPaths
      .slice(start, end)
      .reduce(
        (collation, vertices) => {
          collation.push(...vertices);
          return collation;
        },
        [],
      ),
  );
};

/**
 * Derives keyframes as an array of numbers from a timeline property.
 *
 * e.g. given {0: {value: 'foo'}, 10: {value: 'bar'}}, returns [0, 10].
 * @param timelineProperty
 * @returns {number[]}
 */
export const keyframesFromTimelineProperty = (timelineProperty): number[] => {
  const keyframes: number[] = Object.keys(timelineProperty).map((i) => parseInt(i, 10));
  keyframes.sort((a, b) => a - b);
  return keyframes;
};

/**
 * Determines if timeline values are equivalent.
 *
 * TODO: Make this more performant by utilizing the allowed values of the timeline.
 */
export const timelineValuesAreEquivalent = (valueA: any, valueB: any): boolean =>
  JSON.stringify(valueA) === JSON.stringify(valueB);
