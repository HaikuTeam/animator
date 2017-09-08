var assign = require('lodash.assign')
var defaults = require('lodash.defaults')
var BasicUtils = require('@haiku/player/src/helpers/BasicUtils')
var isSerializedFunction = require('./isSerializedFunction')

var MERGE_STRATEGIES = {
  assign: 'assign',
  defaults: 'defaults'
}

function mergeAppliedValue (name, valueDescriptor, incomingValue, mergeStrategy) {
  if (BasicUtils.isObject(valueDescriptor.value) && BasicUtils.isObject(incomingValue) && !isSerializedFunction(valueDescriptor.value) && !isSerializedFunction(incomingValue)) {
    switch (mergeStrategy) {
      case MERGE_STRATEGIES.assign: assign(valueDescriptor.value, incomingValue); break
      case MERGE_STRATEGIES.defaults: defaults(valueDescriptor.value, incomingValue); break
      default: throw new Error('Merge strategy provided is missing or invalid')
    }
  } else {
    switch (mergeStrategy) {
      case MERGE_STRATEGIES.assign: valueDescriptor.value = incomingValue; break
      case MERGE_STRATEGIES.defaults: if (valueDescriptor.value === undefined) valueDescriptor.value = incomingValue; break
      default: throw new Error('Merge strategy provided is missing or invalid')
    }
  }
}

module.exports = mergeAppliedValue
