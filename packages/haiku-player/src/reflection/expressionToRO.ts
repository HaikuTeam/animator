/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let FUNCTION = "function"
let OBJECT = "object"

// The inverse of this function is 'reifyRO'

function expressionToRO(exp, options) {
  if (typeof exp === FUNCTION) {
    return functionToRFO(exp)
  }
  if (Array.isArray(exp)) {
    return arrayToRO(exp)
  }
  if (exp && typeof exp === OBJECT) {
    // If we got an object that already looks like a 'RO', then pass it through unmodified
    // See 'reifyRO' for detail on how this serialization works on the opposite side
    if (exp.__function || exp.__reference || exp.__value) {
      return exp
    }

    return objectToRO(exp, options)
  }
  if (isSerializableScalar(exp)) {
    return exp
  }
}

module.exports = expressionToRO

let isSerializableScalar = require("./isSerializableScalar")
let objectToRO = require("./objectToRO")
let functionToRFO = require("./functionToRFO")
let arrayToRO = require("./arrayToRO")
