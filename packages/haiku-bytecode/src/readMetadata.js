module.exports = function readMetadata (bytecode) {
  if (!bytecode.metadata) bytecode.metadata = {}
  return bytecode.metadata
}
