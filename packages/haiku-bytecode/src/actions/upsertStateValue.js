var unserValue = require('./unserValue')
var upgradeBytecodeInPlace = require('@haiku/player/src/helpers/upgradeBytecodeInPlace')

module.exports = function upsertStateValue (bytecode, stateName, stateDescriptor) {
  // To convert legacy properties array to states object
  upgradeBytecodeInPlace(bytecode)

  if (!bytecode.states) {
    bytecode.states = {}
  }

  if (!bytecode.states[stateName]) {
    bytecode.states[stateName] = {}
  }

  if (stateDescriptor.type !== undefined) {
    bytecode.states[stateName].type = stateDescriptor.type
  }

  if (stateDescriptor.value !== undefined) {
    bytecode.states[stateName].value = stateDescriptor.value
  }

  if (stateDescriptor.access !== undefined) {
    bytecode.states[stateName].access = stateDescriptor.access
  }

  if (stateDescriptor.mock !== undefined) {
    bytecode.states[stateName].mock = stateDescriptor.mock
  }

  if (stateDescriptor.get !== undefined) {
    bytecode.states[stateName].get = unserValue(stateDescriptor.get)
  }

  if (stateDescriptor.set !== undefined) {
    bytecode.states[stateName].set = unserValue(stateDescriptor.set)
  }

  return bytecode
}
