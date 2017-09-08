var upgradeBytecodeInPlace = require('@haiku/player/lib/helpers/upgradeBytecodeInPlace')

module.exports = function readAllEventHandlers (bytecode) {
  // To convert legacy event handlers array to object
  upgradeBytecodeInPlace(bytecode)

  if (!bytecode.eventHandlers) {
    bytecode.eventHandlers = {}
  }

  return bytecode.eventHandlers
}
