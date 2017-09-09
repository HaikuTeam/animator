/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import expressionToRO from "./expressionToRO"

export default function arrayToRO(arr) {
  let out = []
  for (let i = 0; i < arr.length; i++) {
    out[i] = expressionToRO(arr[i], null)
  }
  return out
}
