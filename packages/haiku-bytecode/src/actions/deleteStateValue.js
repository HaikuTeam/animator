var upgradeBytecodeInPlace = require('@haiku/player/lib/helpers/upgradeBytecodeInPlace').default

module.exports = function deleteStateValue (bytecode, stateName) {
  // To convert legacy properties array to states object
  upgradeBytecodeInPlace(bytecode)

  if (bytecode.states) {
    delete bytecode.states[stateName]
  }

  return bytecode
}
