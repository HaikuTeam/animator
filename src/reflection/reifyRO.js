/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var reifyRFO = require('./reifyRFO')
var isSerializableScalar = require('./isSerializableScalar')

var OBJECT = 'object'

function reifyRO (robj, referenceEvaluator, skipFunctions) {
  if (robj === undefined) {
    return undefined
  }

  if (isSerializableScalar(robj)) {
    return robj
  }

  if (Array.isArray(robj)) {
    var aout = []
    for (var i = 0; i < robj.length; i++) {
      aout[i] = reifyRO(robj[i], referenceEvaluator, skipFunctions)
    }
    return aout
  }

  if (typeof robj === OBJECT) {
    // Special reference object
    if (robj.__value !== undefined) {
      return reifyRO(robj.__value, referenceEvaluator, skipFunctions)
    }
    if (robj.__function) {
      // The caller might want to reassemble this on their own
      if (skipFunctions) return robj
      return reifyRFO(robj.__function)
    }
    if (robj.__reference) {
      if (referenceEvaluator) return referenceEvaluator(robj.__reference)
      throw new Error('Reference evaluator required')
    }

    // Normal object
    var oout = {}
    for (var key in robj) {
      oout[key] = reifyRO(robj[key], referenceEvaluator, skipFunctions)
    }
    return oout
  }

  return undefined
}

module.exports = reifyRO
