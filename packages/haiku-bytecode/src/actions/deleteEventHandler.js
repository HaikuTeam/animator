var upgradeBytecodeInPlace = require('@haiku/player/lib/helpers/upgradeBytecodeInPlace')

module.exports = function deleteEventHandler (bytecode, selectorName, eventName) {
  // To convert legacy event handlers in array format
  upgradeBytecodeInPlace(bytecode)

  if (bytecode.eventHandlers) {
    if (bytecode.eventHandlers[selectorName]) {
      delete bytecode.eventHandlers[selectorName][eventName]
    }
  }

  return bytecode
}
