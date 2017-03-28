function isTextNode (virtualElement, scopes) {
  return typeof virtualElement === 'string'
}

module.exports = isTextNode
