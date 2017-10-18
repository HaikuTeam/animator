/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import cs from './../vendor/color-string';

const STRING = 'string';
const OBJECT = 'object';

function parseString(str) {
  if (!str) return null;
  if (typeof str === OBJECT) return str;
  if (str.trim().slice(0, 3) === 'url') return str;
  const desc = cs['get'](str);
  return desc;
}

function generateString(desc) {
  if (typeof desc === STRING) return desc;
  if (!desc) return 'none';
  const str = cs['to'][desc.model](desc.value);
  return str;
}

export default {
  parseString,
  generateString,
};
