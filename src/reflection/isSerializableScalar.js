/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var STRING = 'string';
var NUMBER = 'number';
var BOOLEAN = 'boolean';

function isSerializableScalar(value) {
  return value === null ||
    typeof value === NUMBER ||
    typeof value === STRING ||
    typeof value === BOOLEAN;
}

module.exports = isSerializableScalar;
