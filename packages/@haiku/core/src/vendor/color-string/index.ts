/**
 * The MIT License
 *
 * Copyright (c) 2011 Heather Arthur <fayearthur@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */

import ColorNames from '../color-names';

const reverseNames = {};

// create a list of reverse color names
for (const name in ColorNames) {
  if (ColorNames.hasOwnProperty(name)) {
    reverseNames[ColorNames[name]] = name;
  }
}

export type ColorValue = [number, number, number, number];

export interface ColorSpec {
  model: string;
  value: ColorValue;
}

export const get = (string): ColorSpec => {
  const prefix = string.substring(0, 3).toLowerCase();
  let val;
  let model;
  switch (prefix) {
    case 'hsl':
      val = getHsl(string);
      model = 'hsl';
      break;
    case 'hwb':
      val = getHwb(string);
      model = 'hwb';
      break;
    default:
      val = getRgb(string);
      model = 'rgb';
      break;
  }

  if (!val) {
    return null;
  }

  return {
    model,
    value: val,
  };
};

const getRgb = (string): ColorValue => {
  if (!string) {
    return null;
  }

  const abbr = /^#([a-f0-9]{3,4})$/i;
  const hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
  const rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/;
  const per = /^rgba?\(\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/;
  const keyword = /(\D+)/;

  let rgb = [0, 0, 0, 1];
  let match;
  let i;
  let hexAlpha;

  const hexMatch = string.match(hex);
  const abbrMatch = string.match(abbr);
  const rgbaMatch = string.match(rgba);
  const perMatch = string.match(per);
  const keywordMatch = string.match(keyword);

  if (hexMatch) {
    match = hexMatch;
    hexAlpha = match[2];
    match = match[1];

    for (i = 0; i < 3; i++) {
      // https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
      const i2 = i * 2;
      rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
    }

    if (hexAlpha) {
      rgb[3] = Math.round(parseInt(hexAlpha, 16) / 255 * 100) / 100;
    }
  } else if (abbrMatch) {
    match = abbrMatch;
    match = match[1];
    hexAlpha = match[3];

    for (i = 0; i < 3; i++) {
      rgb[i] = parseInt(match[i] + match[i], 16);
    }

    if (hexAlpha) {
      rgb[3] = Math.round(parseInt(hexAlpha + hexAlpha, 16) / 255 * 100) / 100;
    }
  } else if (rgbaMatch) {
    match = rgbaMatch;
    for (i = 0; i < 3; i++) {
      rgb[i] = parseInt(match[i + 1], 0);
    }

    if (match[4]) {
      rgb[3] = parseFloat(match[4]);
    }
  } else if (perMatch) {
    match = perMatch;
    for (i = 0; i < 3; i++) {
      rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
    }

    if (match[4]) {
      rgb[3] = parseFloat(match[4]);
    }
  } else if (keywordMatch) {
    match = keywordMatch;
    if (match[1] === 'transparent') {
      return [0, 0, 0, 0];
    }

    rgb = ColorNames[match[1]];

    if (!rgb) {
      return null;
    }

    rgb[3] = 1;

    return rgb as ColorValue;
  } else {
    return null;
  }

  for (i = 0; i < 3; i++) {
    rgb[i] = clamp(rgb[i], 0, 255);
  }
  rgb[3] = clamp(rgb[3], 0, 1);

  return rgb as ColorValue;
};

const getHsl = (string): ColorValue => {
  if (!string) {
    return null;
  }

  const hsl = /^hsla?\(\s*([+-]?\d*[.]?\d+)(?:deg)?\s*,\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/;
  const match = string.match(hsl);

  if (match) {
    const alpha = parseFloat(match[4]);
    const h = (parseFloat(match[1]) % 360 + 360) % 360;
    const s = clamp(parseFloat(match[2]), 0, 100);
    const l = clamp(parseFloat(match[3]), 0, 100);
    const a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

    return [h, s, l, a];
  }

  return null;
};

const getHwb = (string): ColorValue => {
  if (!string) {
    return null;
  }

  const hwb = /^hwb\(\s*([+-]?\d*[.]?\d+)(?:deg)?\s*,\s*([+-]?[\d.]+)%\s*,\s*([+-]?[\d.]+)%\s*(?:,\s*([+-]?[\d.]+)\s*)?\)$/;
  const match = string.match(hwb);

  if (match) {
    const alpha = parseFloat(match[4]);
    const h = (parseFloat(match[1]) % 360 + 360) % 360;
    const w = clamp(parseFloat(match[2]), 0, 100);
    const b = clamp(parseFloat(match[3]), 0, 100);
    const a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
    return [h, w, b, a];
  }

  return null;
};

export const to = (model: string, rgba: ColorValue): string => {
  switch (model) {
    case 'hex':
      return (
        '#' +
        hexDouble(rgba[0]) +
        hexDouble(rgba[1]) +
        hexDouble(rgba[2]) +
        (rgba[3] < 1 ? hexDouble(Math.round(rgba[3] * 255)) : '')
      );
    case 'rgb':
      return rgba.length < 4 || rgba[3] === 1
        ? 'rgb(' +
               Math.round(rgba[0]) +
               ', ' +
               Math.round(rgba[1]) +
               ', ' +
               Math.round(rgba[2]) +
               ')'
        : 'rgba(' +
               Math.round(rgba[0]) +
               ', ' +
               Math.round(rgba[1]) +
               ', ' +
               Math.round(rgba[2]) +
               ', ' +
               rgba[3] +
               ')';
    case 'hsl':
      return rgba.length < 4 || rgba[3] === 1
        ? 'hsl(' + rgba[0] + ', ' + rgba[1] + '%, ' + rgba[2] + '%)'
        : 'hsla(' +
               rgba[0] +
               ', ' +
               rgba[1] +
               '%, ' +
               rgba[2] +
               '%, ' +
               rgba[3] +
               ')';
    case 'hwb':
      // hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
      // (hwb have alpha optional & 1 is default value)
      let a = '';
      if (rgba.length >= 4 && rgba[3] !== 1) {
        a = ', ' + rgba[3];
      }

      return 'hwb(' + rgba[0] + ', ' + rgba[1] + '%, ' + rgba[2] + '%' + a + ')';
  }
};

const clamp = (num, min, max) => Math.min(Math.max(min, num), max);

const hexDouble = (num) => {
  const str = num.toString(16).toUpperCase();
  return str.length < 2 ? '0' + str : str;
};
