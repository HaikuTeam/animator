module.exports = function readAllStateValues (bytecode) {
  if (!bytecode.states) {
    bytecode.states = {}
  }

  return bytecode.states
}
