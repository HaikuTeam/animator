var upgradeBytecodeInPlace = require('@haiku/player/src/helpers/upgradeBytecodeInPlace')

module.exports = function readAllStateValues (bytecode) {
  // To convert legacy properties array to states object
  upgradeBytecodeInPlace(bytecode)

  if (!bytecode.states) {
    bytecode.states = {}
  }

  return bytecode.states
}
