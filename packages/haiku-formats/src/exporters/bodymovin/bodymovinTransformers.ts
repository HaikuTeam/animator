/** @file Transformers for Bodymovin quirks. */
import ColorUtils from 'haiku-player/lib/helpers/ColorUtils';
import {StrokeLinecap} from './bodymovinEnums';

/**
 * Transforms CSS opacity in [0, 1] to Bodymovin opacity in [0, 100].
 * @param opacity
 */
export const opacityTransformer = (opacity) => 100 * opacity;

/**
 * Transforms CSS scale in [0, 1] to Bodymovin scale in [0, 100].
 * @param scale
 */
export const scaleTransformer = (scale) => 100 * scale;

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
  if (colorModel === null) {
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
 */
export const rotationTransformer = (radians: number) => radians * 360 / 2 / Math.PI;

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
