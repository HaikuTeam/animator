import {PropertyKey} from './bodymovinEnums';
import {BodymovinProperty} from './bodymovinTypes';

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
 * Translate SVG points to Bodymovin vertices.
 * @param {string} svgPoints
 * @returns {[number, number][]}
 */
export const pointsToVertices = (svgPoints: string): [number, number][] => {
  // Normalize "x1,y1 x2,y2" syntax to "x1 y1 x2 y2" syntax before splitting
  const points: number[] = svgPoints.replace(/,/g, ' ').split(' ').map(Number);
  const chunkedPoints = [];
  for (let i = 0; i < points.length; i += 2) {
    chunkedPoints.push(points.slice(i, i + 2));
  }
  return chunkedPoints;
};
