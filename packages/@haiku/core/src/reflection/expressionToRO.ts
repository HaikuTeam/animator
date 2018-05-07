/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
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
    // If we got an object that already looks like a 'RO', then pass it through unmodified.
    // Note that we only want to include the super-private members __*, since the object might
    // inadvertently be storing other properties that aren't suited to serialization.
    // See 'reifyRO' for detail on how this serialization works on the opposite side.
    if (exp.__function) {
      return {
        __function: exp.__function,
      };
    }

    if (exp.__reference) {
      return {
        __reference: exp.__reference,
      };
    }

    if (exp.__value) {
      return {
        __value: exp.__value,
      };
    }

    return objectToRO(exp, options);
  }

  if (isSerializableScalar(exp)) {
    return exp;
  }

  return exp;
}
