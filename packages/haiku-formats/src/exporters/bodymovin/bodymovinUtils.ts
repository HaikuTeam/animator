import {PathKey, PropertyKey} from './bodymovinEnums';
import {BodymovinCoordinates, BodymovinPathComponent, BodymovinProperty} from './bodymovinTypes';
import SVGPoints from 'haiku-player/lib/helpers/SVGPoints';
const {pathToPoints} = SVGPoints;

/**
 * Reducer for a compound timeline property.
 * TODO: Add support for a compound animated property.
 * @param accumulator
 * @param currentValue
 * @returns {{}}
 */
export const compoundTimelineReducer = (accumulator, currentValue) => {
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
  const value = {} as BodymovinProperty;
  value[PropertyKey.Animated] = 0;
  value[PropertyKey.Value] = fixedValue;
  return value;
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
export const pathToInterpolationTrace = (path: string) => {
  const vertices: BodymovinPathComponent = [];
  const interpolationInPoints: BodymovinPathComponent = [];
  const interpolationOutPoints: BodymovinPathComponent = [];

  // TODO: Don't assume the path is closed.
  const points = pathToPoints(path);

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
