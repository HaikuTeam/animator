/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var FUNCTION = 'function'
var OBJECT = 'object'

function expressionToRO (exp, options) {
  if (typeof exp === FUNCTION) {
    return functionToRFO(exp)
  }
  if (Array.isArray(exp)) {
    return arrayToRO(exp)
  }
  if (exp && typeof exp === OBJECT) {
    return objectToRO(exp, options)
  }
  if (isSerializableScalar(exp)) {
    return exp
  }
}

module.exports = expressionToRO

var isSerializableScalar = require('./isSerializableScalar')
var objectToRO = require('./objectToRO')
var functionToRFO = require('./functionToRFO')
var arrayToRO = require('./arrayToRO')
