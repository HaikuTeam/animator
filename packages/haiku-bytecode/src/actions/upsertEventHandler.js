var unserValue = require('./unserValue')
var upgradeBytecodeInPlace = require('@haiku/player/lib/helpers/upgradeBytecodeInPlace').default

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

  // The 'edited' flag is used to determine whether a property is overwriteable during a merge.
  // In multi-component, theoretically both designs can be merged and components can be merged.
  bytecode.eventHandlers[selectorName][eventName].edited = true

  return bytecode
}
