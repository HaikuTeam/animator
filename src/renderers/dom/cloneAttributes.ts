function _cloneAttributes (attributes) {
  if (!attributes) return {}
  var clone = {}
  for (var key in attributes) {
    clone[key] = attributes[key]
  }
  return clone
}

module.exports = _cloneAttributes
