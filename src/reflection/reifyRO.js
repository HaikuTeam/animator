/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var OBJECT = 'object'
var FUNCTION = 'function'

// The inverse of this function is 'expressionToRO'

function reifyRO (robj, referenceEvaluator, skipFunctions) {
  if (robj === undefined) {
    return undefined
  }

  if (typeof robj === FUNCTION) {
    // More or less, clone the function and strip off any properties that may have been
    // applied to it at runtime for e.g. caching, which we don't want hanging around the new copy.
    // Note that we *cannot* just call fn.bind({}) here because then newfn.toString() would
    // return a string like "function () { [native code] }" which we can then not parse!
    return reifyRO(expressionToRO(robj), referenceEvaluator, skipFunctions)
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

var expressionToRO = require('./expressionToRO')
var reifyRFO = require('./reifyRFO')
var isSerializableScalar = require('./isSerializableScalar')
