/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let expressionToRO = require("./expressionToRO")

function arrayToRO(arr) {
  let out = []
  for (let i = 0; i < arr.length; i++) {
    out[i] = expressionToRO(arr[i])
  }
  return out
}

module.exports = arrayToRO
