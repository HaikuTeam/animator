import SVGPoints from '@haiku/core/lib/helpers/SVGPoints';
import {CurveSpec} from '@haiku/core/lib/vendor/svg-points/types';

import {BytecodeTimelineProperty} from '@haiku/core/lib/api';
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
  BodymovinDimensions,
  BodymovinPathComponent,
  BodymovinProperty,
  Keyframe,
} from './bodymovinTypes';

const {polyPointsStringToPoints} = SVGPoints;

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
const animatedTimelineReducer = (accumulator: any, currentValue: any) => {
  if (Object.keys(accumulator).length === 0) {
    return currentValue;
  }

  currentValue[PropertyKey.Value].forEach((keyframe: any, index: any) => {
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
export const compoundTimelineReducer = (accumulator: any, currentValue: any) => {
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
export const getBodymovinVersion = () => require('../../../package.json').devDependencies['lottie-web'];

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
  if (typeof maybePercent === 'string' && /%$/.test(maybePercent)) {
    return parseFloat(maybePercent.replace('%', '')) * basis / 100;
  }

  return Number(maybePercent);
};

/**
 * Gets the dimensions of a shape constructed during shape-parsing.
 * @param shape
 * @returns {[number , number]}
 */
export const getShapeDimensions = (shape: any): BodymovinDimensions => {
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
      const vertices = [];
      if (shape[ShapeKey.Vertices][PropertyKey.Animated]) {
        vertices.push(...shape[ShapeKey.Vertices][PropertyKey.Value].reduce(
          (accumulator: BodymovinDimensions[], value: Keyframe<BodymovinDimensions>) => {
            if (value.hasOwnProperty(AnimationKey.Start)) {
              accumulator.push(...value[AnimationKey.Start], ...value[AnimationKey.End]);
            }
            return accumulator;
          }, []));
      } else {
        vertices.push(...shape[ShapeKey.Vertices][PropertyKey.Value][PathKey.Points]);
      }

      return [
        Math.max(...vertices.map((vertex: number[]) => vertex[0])),
        Math.max(...vertices.map((vertex: number[]) => vertex[1])),
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
export const maybeApplyMutatorToProperty = (
  property: any,
  mutator: (param: any) => any,
  disableRecursion: boolean = false,
) => {
  if (mutator === undefined) {
    return property;
  }

  if (Array.isArray(property) && !disableRecursion) {
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
 * @returns {[key in PathKey]: BodymovinPathComponent}
 * @param points
 */
export const pathToInterpolationTrace = (points: CurveSpec[]) => {
  const vertices: BodymovinPathComponent = [];
  const interpolationInPoints: BodymovinPathComponent = [];
  const interpolationOutPoints: BodymovinPathComponent = [];

  // Force the last vertex to be the same as the first so we can use the same algorithm for closed and open paths.
  // The renderer will respect the value of "closed" we pass below.
  if (points.length > 1 &&
    (points[0].x !== points[points.length - 1].x || points[0].y !== points[points.length - 1].y)) {
    points.push(points[0]);
  }

  let lastVertex: BodymovinCoordinates;
  let closed: boolean = false;
  points.forEach((point, index) => {
    if (point.closed) {
      closed = true;
    }
    if (index === 0) {
      // We are at a moveto. This pushes a new vertex onto our trace.
      vertices.push(lastVertex = [point.x, point.y]);
    } else if (point.curve) {
      // TODO: Actually check the curve for validity (e.g. NaNs where NaNs are illegal).
      if (point.curve.type !== 'cubic') {
        // TODO: Support quadratic beziers and arcs.
        throw new Error(`Unsupported curve type: ${point.curve.type}!`);
      }
      interpolationOutPoints.push([point.curve.x1, point.curve.y1]); // This is the last out point.
      interpolationInPoints.push([point.curve.x2, point.curve.y2]); // This is the current in point.
      vertices.push(lastVertex = [point.x, point.y]);
    } else {
      // We are at a lineto. This pushes a new vertex onto our trace and creates a "null interpolation".
      interpolationOutPoints.push(lastVertex);
      vertices.push(lastVertex = [point.x, point.y]);
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
export const pointsToInterpolationTrace = (svgPoints: string|[number, number][]) => {
  const chunkedPoints = polyPointsStringToPoints(svgPoints);

  // To support Bodymovin export format, we have to create a "dummy curve" with null interpolation points.
  // tslint:disable-next-line:prefer-array-literal
  const dummyCurve = new Array(chunkedPoints.length);
  dummyCurve.fill([0, 0]);
  return {
    [PathKey.Closed]: true,
    [PathKey.Points]: chunkedPoints,
    [PathKey.InterpolationIn]: dummyCurve,
    [PathKey.InterpolationOut]: dummyCurve,
  };
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
export const decomposePath = (path: string|CurveSpec[]): {points: CurveSpec[], closed: boolean}[] => {
  if (!Array.isArray(path)) {
    return decomposePath(SVGPoints.pathToPoints(path));
  }

  const allClosedPaths: {
    points: CurveSpec[];
    closed: boolean;
  }[] = [];
  if (path.length < 2) {
    return allClosedPaths;
  }

  let lastIndex = 0;
  for (let i = 0; i < path.length; ++i) {
    const isImplicitlyClosed = path[i].x === path[lastIndex].x && path[i].y === path[lastIndex].y;
    if (path[i].closed || i === path.length - 1) {
      allClosedPaths.push({
        points: path.slice(lastIndex, i + 1),
        closed: path[i].closed || isImplicitlyClosed,
      });
      lastIndex = i + 1;
    }

    if (path[i].moveTo && i !== lastIndex) {
      allClosedPaths.push({
        points: path.slice(lastIndex, i),
        closed: isImplicitlyClosed,
      });
      lastIndex = i;
    }
  }

  return allClosedPaths;
};

/**
 * Derives keyframes as an array of numbers from a timeline property.
 *
 * e.g. given {0: {value: 'foo'}, 10: {value: 'bar'}}, returns [0, 10].
 * @param timelineProperty
 * @returns {number[]}
 */
export const keyframesFromTimelineProperty = (timelineProperty: BytecodeTimelineProperty): number[] => {
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

/**
 * toJSON() implementation, made safe for the lottie-android streaming parser.
 *
 * That streaming parser always skips keys until it encounters the `ty` key, so we need to force it to come first.
 * @returns {Object}
 */
export const lottieAndroidStreamSafeToJson = function () {
  if (!this.hasOwnProperty(ShapeKey.Type)) {
    return this;
  }

  const clone = {...this};
  const type = clone[ShapeKey.Type];

  // Foist the `ty` key to artificially be placed first during stringification.
  delete clone[ShapeKey.Type];
  return {
    [ShapeKey.Type]: type,
    ...clone,
  };
};
