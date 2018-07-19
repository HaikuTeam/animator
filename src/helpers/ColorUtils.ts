/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */
import {get, to} from './../vendor/color-string';

const STRING = 'string';
const OBJECT = 'object';

function parseString (str) {
  if (!str) {
    return null;
  }
  if (typeof str === OBJECT || (typeof str === STRING && str.trim().slice(0, 3) === 'url')) {
    return str;
  }
  return get(String(str));
}

function generateString (desc) {
  if (typeof desc === STRING) {
    return desc;
  }
  if (!desc) {
    return 'none';
  }
  return to(desc.model, desc.value);
}

export default {
  parseString,
  generateString,
};
