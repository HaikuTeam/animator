/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import arrayToRO from './arrayToRO';
import functionToRFO from './functionToRFO';
import isSerializableScalar from './isSerializableScalar';
import objectToRO from './objectToRO';

const FUNCTION = 'function';
const OBJECT = 'object';

// The inverse of this function is 'reifyRO'

export default function expressionToRO(exp, options) {
  if (typeof exp === FUNCTION) {
    return functionToRFO(exp);
  }

  if (Array.isArray(exp)) {
    return arrayToRO(exp);
  }

  if (exp && typeof exp === OBJECT) {
    // If we got an object that already looks like a 'RO', then pass it through unmodified
    // See 'reifyRO' for detail on how this serialization works on the opposite side
    if (exp.__function || exp.__reference || exp.__value) {
      return exp;
    }

    return objectToRO(exp, options);
  }

  if (isSerializableScalar(exp)) {
    return exp;
  }
}
