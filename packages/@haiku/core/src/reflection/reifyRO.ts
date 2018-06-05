/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import expressionToRO from './expressionToRO';
import isSerializableScalar from './isSerializableScalar';
import reifyRFO from './reifyRFO';

const OBJECT = 'object';
const FUNCTION = 'function';

// The inverse of this function is 'expressionToRO'

export default function reifyRO (robj, referenceEvaluator, skipFunctions) {
  if (robj === undefined) {
    return undefined;
  }

  if (typeof robj === FUNCTION) {
    // More or less, clone the function and strip off any properties that may have been
    // applied to it at runtime for e.g. caching, which we don't want hanging around the new copy.
    // Note that we *cannot* just call fn.bind({}) here because then newfn.toString() would
    // return a string like "function () { [native code] }" which we can then not parse!
    return reifyRO(expressionToRO(robj, null), referenceEvaluator, skipFunctions);
  }

  if (isSerializableScalar(robj)) {
    return robj;
  }

  if (Array.isArray(robj)) {
    const aout = [];
    for (let i = 0; i < robj.length; i++) {
      aout[i] = reifyRO(robj[i], referenceEvaluator, skipFunctions);
    }
    return aout;
  }

  if (typeof robj === OBJECT) {
    // Special reference object
    if (robj.__value !== undefined) {
      return reifyRO(robj.__value, referenceEvaluator, skipFunctions);
    }
    if (robj.__function) {
      // The caller might want to reassemble this on their own
      if (skipFunctions) {
        return robj;
      }
      return reifyRFO(robj.__function);
    }
    if (robj.__reference) {
      if (referenceEvaluator) {
        return referenceEvaluator(robj.__reference);
      }
      throw new Error('Reference evaluator required');
    }

    // Normal object
    const oout = {};
    for (const key in robj) {
      oout[key] = reifyRO(robj[key], referenceEvaluator, skipFunctions);
    }
    return oout;
  }

  return undefined;
}
