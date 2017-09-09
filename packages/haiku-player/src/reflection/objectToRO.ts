/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import expressionToRO from "./expressionToRO"

export default function objectToRO(obj, options) {
  let out = {}
  for (let key in obj) {
    if (options && options.ignore && options.ignore.test(key)) continue
    out[key] = expressionToRO(obj[key], options)
  }
  return out
}
