/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import expressionToRO from './expressionToRO';

export default function objectToRO(obj, options) {
  const out = {};
  for (const key in obj) {
    if (options && options.ignore && options.ignore.test(key)) {
      continue;
    }
    out[key] = expressionToRO(obj[key], options);
  }
  return out;
}
