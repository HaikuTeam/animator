/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var cs = require('./ColorString');

var STRING = 'string';
var OBJECT = 'object';

function parseString(str) {
  if (!str) return null;
  if (typeof str === OBJECT) return str;
  if (str.trim().slice(0, 3) === 'url') return str;
  var desc = cs.get(str);
  return desc;
}

function generateString(desc) {
  if (typeof desc === STRING) return desc;
  if (!desc) return 'none';
  var str = cs.to[desc.model](desc.value);
  return str;
}

module.exports = {
  parseString: parseString,
  generateString: generateString
};
