module.exports = function readAllEventHandlers (bytecode) {
  if (!bytecode.eventHandlers) {
    bytecode.eventHandlers = {}
  }

  return bytecode.eventHandlers
}
