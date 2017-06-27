/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var uniq = require('./../vendor/array-unique').immutable

var OBJECT = 'object'
var FUNCTION = 'function'

function isObject (value) {
  return value !== null && typeof value === OBJECT && !Array.isArray(value)
}

function isFunction (value) {
  return typeof value === FUNCTION
}

function isEmpty (value) {
  return value === undefined
}

function mergeIncoming (previous, incoming) {
  for (var key in incoming) {
    // Skip if there's no incoming property
    if (isEmpty(incoming[key])) continue
    // Deep merge if we have two objects
    if (isObject(previous[key]) && isObject(incoming[key])) {
      previous[key] = mergeIncoming(previous[key], incoming[key])
      continue
    }
    // In the default case, we just overwrite
    previous[key] = incoming[key]
  }
  return previous
}

function mergeValue (previous, incoming) {
  if (isFunction(previous) || isFunction(incoming)) {
    return incoming
  }
  if (isObject(previous) && isObject(incoming)) {
    return mergeIncoming(previous, incoming)
  }
  return incoming
}

module.exports = {
  isObject: isObject,
  isFunction: isFunction,
  isEmpty: isEmpty,
  mergeIncoming: mergeIncoming,
  mergeValue: mergeValue,
  uniq: uniq
}
