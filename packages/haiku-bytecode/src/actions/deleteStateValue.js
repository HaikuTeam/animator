module.exports = function deleteStateValue (bytecode, stateName) {
  if (bytecode.states) {
    delete bytecode.states[stateName]
  }

  return bytecode
}
