module.exports = function deleteEventHandler (bytecode, selectorName, eventName) {
  if (bytecode.eventHandlers) {
    if (bytecode.eventHandlers[selectorName]) {
      delete bytecode.eventHandlers[selectorName][eventName]
    }
  }

  return bytecode
}
