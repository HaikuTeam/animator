import {PathKey, PropertyKey} from './bodymovinEnums';
import {BodymovingPathComponent, BodymovinProperty} from './bodymovinTypes';

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
 * Translate a hex code to an After Effects color.
 *
 * After Effects colors are a 4-element [r, g, b, a] array where each element is normalized in [0, 1].
 * TODO: Support 4- and 8-digit hex codes as well.
 * @see {@link https://drafts.csswg.org/css-color/}
 * @param {string} hexCode
 * @returns {[number , number , number , number]}
 */
export const hexToAfterEffectsColor = (hexCode: string) => {
  const quotient = (2 << 7) - 1;
  const hex = parseInt(hexCode.replace('#', ''), 16);
  return [(hex >> 16) / quotient, (hex >> 8 & 0xFF) / quotient, (hex & 0xFF) / quotient, 1];
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
 * Translates an SVG path to a Bodymovin interpolation trace.
 * @param {string} path
 * @returns {[key in PathKey]: BodymovingPathComponent}
 */
export const pathToInterpolationTrace = (path: string) => {
  const vertices: BodymovingPathComponent = [];
  const interpolationInPoints: BodymovingPathComponent = [];
  const interpolationOutPoints: BodymovingPathComponent = [];

  // Translate path into a sequence of path components. But first, normalize Mx,y syntax into Mx y syntax for easier
  // parsing.
  const translations = path.replace(/,/g, ' ').split(/\s*[A-Z]\s*/i);
  while (translations[0] === '') {
    translations.shift();
  }
  const translationTypes = path.match(/[A-Z]/ig);
  const numTranslations = translations.length;
  if (translationTypes.length !== numTranslations) {
    // This should never happen!
    throw new Error(`Unable to comprehend vector path: ${path}`);
  }
  if (['Z', 'z'].indexOf(translationTypes[translationTypes.length - 1]) === -1) {
    // TODO: Support paths that are not closed.
    throw new Error(`Encountered unclosed path: ${path}`);
  }

  let lastVertex;
  for (const i in translationTypes) {
    const translationType = translationTypes[i];
    const translation = translations[i];
    switch (translationType) {
      case 'M':
        // We are at a moveto. This pushes a new vertex onto our trace.
        vertices.push(lastVertex = translation.split(' ').map(Number) as [number, number]);
        break;
      case 'L':
        // We are at a lineto. This pushes a new vertex onto our trace and creates a "null interpolation".
        interpolationOutPoints.push(lastVertex);
        vertices.push(lastVertex = translation.split(' ').map(Number) as [number, number]);
        interpolationInPoints.push(lastVertex);
        break;
      case 'C':
        // We are at a curveto directive.
        const bezierPoints = pointsToVertices(translation);
        if (bezierPoints.length !== 3) {
          throw new Error(`Encountered nonsensical bezier curve description: ${translation}!`);
        }
        interpolationOutPoints.push(bezierPoints[0]); // This is the last out point.
        interpolationInPoints.push(bezierPoints[1]); // This is the current in point.
        vertices.push(lastVertex = bezierPoints[2]);
        break;
      case 'Z':
      case 'z':
        // We are at a closepath directive. The translation value doesn't matter here (but really should be empty
        // string). We should now unshift the last in-point to the top of the stack and remove the final vertex,
        // which is a dupe. Note: when we add support for non-closed shapes, this will become much harder!
        if (vertices.length > 1) {
          interpolationInPoints.unshift(interpolationInPoints.pop());
          vertices.pop();
        } else if (vertices.length === 1) {
          interpolationInPoints.push(vertices[0]);
          interpolationOutPoints.push(vertices[0]);
        } else {
          return {};
        }
        break;
      default:
        // TODO: Support relative moveto (m), relative lineto (l), quadratic beziers (Q and q), and arcto (A).
        throw new Error(`Encountered unsupported SVG directive: ${translationType}`);
    }
  }

  // Translate all interpolation points relative to their corresponding vertices.
  interpolationInPoints.forEach((value, index) => {
    interpolationInPoints[index] = [value[0] - vertices[index][0], value[1] - vertices[index][1]];
  });
  interpolationOutPoints.forEach((value, index) => {
    interpolationOutPoints[index] = [value[0] - vertices[index][0], value[1] - vertices[index][1]];
  });

  return {
    [PathKey.Points]: vertices,
    [PathKey.InterpolationIn]: interpolationInPoints,
    [PathKey.InterpolationOut]: interpolationOutPoints,
  };
};

/**
 * Translate SVG points to Bodymovin vertices.
 * @param {string} svgPoints
 * @returns {[number, number][]}
 */
export const pointsToVertices = (svgPoints: string): BodymovingPathComponent => {
  // Normalize "x1,y1 x2,y2" syntax to "x1 y1 x2 y2" syntax before splitting
  const points: number[] = svgPoints.replace(/,/g, ' ').split(' ').map(Number);
  const chunkedPoints = [];
  for (let i = 0; i < points.length; i += 2) {
    chunkedPoints.push(points.slice(i, i + 2));
  }
  return chunkedPoints;
};
