/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var expressionToRO = require('./expressionToRO');

function arrayToRO(arr) {
  var out = [];
  for (var i = 0; i < arr.length; i++) {
    out[i] = expressionToRO(arr[i]);
  }
  return out;
}

module.exports = arrayToRO;
