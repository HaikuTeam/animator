/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function objectToRO(obj, options) {
  let out = {}
  for (let key in obj) {
    if (options && options.ignore && options.ignore.test(key)) continue
    out[key] = expressionToRO(obj[key], options)
  }
  return out
}

module.exports = objectToRO

let expressionToRO = require("./expressionToRO")
