/** @file Transformers for Bodymovin quirks. */
import ColorUtils from '@haiku/core/lib/helpers/ColorUtils';
import {
  DasharrayKey,
  DasharrayRole,
  FillRule,
  LayerKey,
  StrokeLinecap,
  StrokeLinejoin,
} from './bodymovinEnums';
import {getFixedPropertyValue} from './bodymovinUtils';

/**
 * Transforms CSS opacity in [0, 1] to Bodymovin opacity in [0, 100].
 * @param opacity
 */
export const opacityTransformer = (opacity: number) => 100 * opacity;

/**
 * Transforms CSS scale in [0, 1] to Bodymovin scale in [0, 100].
 * @param scale
 */
export const scaleTransformer = (scale: number) => 100 * scale;

/**
 * Gets a match array for a value reference, e.g. for a property value like fill="url('#foobar')".
 *
 * This method will either return an array like [_, "foobar"] or null.
 * @param {string} value
 * @returns {RegExpMatchArray}
 */
export const getValueReferenceMatchArray = (value: string): RegExpMatchArray =>
  value.match(/\s*url\(\s*['"]?#([\w\-\_]+)['"]?\s*\)/);

/**
 * Translates a CSS color to an After Effects color.
 *
 * After Effects colors are a 4-element [r, g, b, a] array where each element is normalized in [0, 1].
 * TODO: Support 4- and 8-digit hex codes as well.
 * @see {@link https://drafts.csswg.org/css-color/}
 * @param {string} color
 * @returns {[number , number , number , number]}
 */
export const colorTransformer = (color: string) => {
  const colorModel: {value: [number, number, number, number]} = ColorUtils.parseString(color);
  if (colorModel === null || typeof colorModel === 'string') {
    return [0, 0, 0, 0];
  }

  const quotient = (2 << 7) - 1;
  return [
    colorModel.value[0] / quotient,
    colorModel.value[1] / quotient,
    colorModel.value[2] / quotient,
    colorModel.value[3],
  ];
};

/**
 * Translates a CSS rotation (radians) to an After Effects rotation (degrees).
 * @param {number} radians
 * @returns {number}
 */
export const rotationTransformer = (radians: number) => radians * 180 / Math.PI;

/**
 * Transforms a CSS strokeLinecap into an After Effects Line Cap.
 * @param {string} linecap
 * @returns {StrokeLinecap}
 */
export const linecapTransformer = (linecap: string) => {
  switch (linecap) {
    case 'butt':
      return StrokeLinecap.Butt;
    case 'round':
      return StrokeLinecap.Round;
    default:
      return StrokeLinecap.Square;
  }
};

/**
 * Transforms a CSS strokeLinejoin into an After Effects Line Join.
 * @param {string} linejoin
 * @returns {StrokeLinejoin}
 */
export const linejoinTransformer = (linejoin: string) => {
  switch (linejoin) {
    case 'round':
      return StrokeLinejoin.Round;
    case 'bevel':
      return StrokeLinejoin.Bevel;
    default:
      return StrokeLinejoin.Miter;
  }
};

/**
 * Transforms a CSS strokeLinejoin into an After Effects Fill Rule.
 * @param {string} fillrule
 * @returns {FillRule}
 */
export const fillruleTransformer = (fillrule: string) => {
  switch (fillrule) {
    case 'evenodd':
      return FillRule.Evenodd;
    default:
      return FillRule.Nonzero;
  }
};

/**
 * Storage for dash array roles, which obey the typical behavior that even entries are dashes and odd entries are gaps.
 * @type {DasharrayRole[]}
 * @private
 */
const dasharrayRoles = [DasharrayRole.Dash, DasharrayRole.Gap];

/**
 * Transforms a CSS strokeDasharray into After Effects Dashes.
 * @param {string} dasharray
 * @returns {{[key in DasharrayKey]: any}[]}
 */
export const dasharrayTransformer = (dasharray: string) => {
  if (!dasharray) {
    return [];
  }

  // Get dash gaps as an array of numbers, and double it if we have an odd number of values.
  let dashGaps = dasharray.split(',').map((value) => Number(value.trim()));
  if (dashGaps.length % 2 === 1) {
    dashGaps = dashGaps.concat(dashGaps);
  }

  return dashGaps.map((value, index) => ({
    [DasharrayKey.Role]: dasharrayRoles[index % 2],
    [DasharrayKey.Value]: getFixedPropertyValue(value),
    [LayerKey.Name]: index.toString(),
  }));
};
