function getObjectPropertyKey (node) {
  return node.key.name || node.key.value
}

module.exports = getObjectPropertyKey
