module.exports = function writeMetadata (bytecode, metadata) {
  if (!bytecode.metadata) bytecode.metadata = {}
  if (metadata) {
    for (var key in metadata) {
      if (metadata[key] !== undefined) {
        bytecode.metadata[key] = metadata[key]
      }
    }
  }
}
