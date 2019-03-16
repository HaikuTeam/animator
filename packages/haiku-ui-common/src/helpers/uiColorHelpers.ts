import {get, to} from '@haiku/core/lib/vendor/color-string/index';
import {ColorResult} from 'react-color';

export enum DisplayValues {
  HEX,
  HSL,
  RGB,
}

export function derivateDisplayValueFromColorString (colorString: string) {
  if (typeof colorString !== 'string' || !get(colorString)) {
    return null;
  }

  return colorString.charAt(0) === '#'
    ? DisplayValues.HEX
    : DisplayValues[get(colorString).model.toUpperCase()] || DisplayValues.HEX;
}

export function derivateStringFromColorResult (result: ColorResult & { source: string }) {
  const values: [number, number, number, number] =
  Number(result.source) === DisplayValues.HSL
  ? [roundValue(result.hsl.h), roundValue(result.hsl.s * 100), roundValue(result.hsl.l * 100), result.hsl.a]
  : [result.rgb.r, result.rgb.g, result.rgb.b, result.hsl.a];

  return to(DisplayValues[result.source].toLowerCase(), values);
}

function roundValue (value: number) {
  return Number((value).toFixed(2));
}
