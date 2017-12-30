/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import colorString from './../vendor/color-string';

const STRING = 'string';
const OBJECT = 'object';

function parseString(str) {
  if (!str) {
    return null;
  }
  if (typeof str === OBJECT || str.trim().slice(0, 3) === 'url') {
    return str;
  }
  return colorString['get'](str);
}

function generateString(desc) {
  if (typeof desc === STRING) {
    return desc;
  }
  if (!desc) {
    return 'none';
  }
  return colorString['to'][desc.model](desc.value);
}

export default {
  parseString,
  generateString,
};
