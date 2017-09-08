var unserValue = require('./unserValue')
var upgradeBytecodeInPlace = require('@haiku/player/lib/helpers/upgradeBytecodeInPlace')

module.exports = function upsertEventHandler (bytecode, selectorName, eventName, handlerDescriptor) {
  // To convert legacy event handlers array to object
  upgradeBytecodeInPlace(bytecode)

  if (!bytecode.eventHandlers) {
    bytecode.eventHandlers = {}
  }

  if (!bytecode.eventHandlers[selectorName]) {
    bytecode.eventHandlers[selectorName] = {}
  }

  if (!bytecode.eventHandlers[selectorName][eventName]) {
    bytecode.eventHandlers[selectorName][eventName] = {}
  }

  if (handlerDescriptor.handler !== undefined) {
    bytecode.eventHandlers[selectorName][eventName].handler = unserValue(handlerDescriptor.handler)
  }

  return bytecode
}
