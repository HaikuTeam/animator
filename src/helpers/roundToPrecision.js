/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var NUMERIC_PRECISION = 2

function roundToPrecision (num, precision) {
  return parseFloat(num.toFixed(precision || NUMERIC_PRECISION))
}

module.exports = roundToPrecision
