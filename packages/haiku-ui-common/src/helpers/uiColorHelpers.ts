import {get, to} from '@haiku/core/lib/vendor/color-string/index';
import {ColorResult} from 'react-color';

export enum DISPLAY_VALUES {
  HEX,
  HSL,
  RGB,
}

export function derivateDisplayValueFromColorString (colorString: string) {
  if (typeof colorString !== 'string') {
    return DISPLAY_VALUES.HEX;
  }

  return colorString.charAt(0) === '#'
    ? DISPLAY_VALUES.HEX
    : DISPLAY_VALUES[get(colorString).model.toUpperCase()] || DISPLAY_VALUES.HEX;
}

export function derivateStringFromColorResult (result: ColorResult & { source: string }) {
  const values: [number, number, number, number] =
  Number(result.source) === DISPLAY_VALUES.HSL
  ? [roundValue(result.hsl.h), roundValue(result.hsl.s * 100), roundValue(result.hsl.l * 100), result.hsl.a]
  : [result.rgb.r, result.rgb.g, result.rgb.b, result.hsl.a];

  return to(DISPLAY_VALUES[result.source].toLowerCase(), values);
}

function roundValue (value: number) {
  return Number((value).toFixed(2));
}
