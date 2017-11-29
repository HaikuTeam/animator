var unserValue = require('./unserValue')
var upgradeBytecodeInPlace = require('@haiku/player/lib/helpers/upgradeBytecodeInPlace').default

module.exports = function batchUpsertEventHandler (bytecode, selectorName, serializedEvents) {
  // To convert legacy event handlers array to object
  upgradeBytecodeInPlace(bytecode)

  if (!bytecode.eventHandlers) {
    bytecode.eventHandlers = {}
  }

  bytecode.eventHandlers[selectorName] = {}

  Object.entries(serializedEvents).forEach(([event, handler]) => {
    bytecode.eventHandlers[selectorName][event] = {}

    if (handler.handler !== undefined) {
      bytecode.eventHandlers[selectorName][event].handler = unserValue(handler.handler)
    }
  })
debugger
  return bytecode
}
