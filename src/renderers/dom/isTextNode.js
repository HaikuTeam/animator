function isTextNode (virtualElement) {
  return typeof virtualElement === 'string'
}

module.exports = isTextNode
