const unserValue = require('./unserValue')

module.exports = function batchUpsertEventHandlers (
  bytecode,
  selectorName,
  serializedEvents
) {
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
