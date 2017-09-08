function indentLines (string, spacer) {
  var lines = string.split('\n')
  var indented = lines.map(function _map (line) {
    return spacer + line
  })
  return indented.join('\n')
}

module.exports = indentLines
