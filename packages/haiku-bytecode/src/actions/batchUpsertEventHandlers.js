var unserValue = require('./unserValue')
var upgradeBytecodeInPlace = require('@haiku/player/lib/helpers/upgradeBytecodeInPlace').default

module.exports = function batchUpsertEventHandlers (
  bytecode,
  selectorName,
  serializedEvents
) {
  // To convert legacy event handlers array to object
  upgradeBytecodeInPlace(bytecode)

  if (!bytecode.eventHandlers) {
    bytecode.eventHandlers = {}
  }

  bytecode.eventHandlers[selectorName] = {}

  Object.entries(serializedEvents).forEach(([event, handlerDescriptor]) => {
    bytecode.eventHandlers[selectorName][event] = {}

    if (handlerDescriptor.handler !== undefined) {
      bytecode.eventHandlers[selectorName][event].handler = unserValue(
        handlerDescriptor.handler
      )
    }
  })

  return bytecode
}
