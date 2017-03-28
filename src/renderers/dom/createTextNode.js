function createTextNode (domElement, textContent, options, scopes) {
  return domElement.ownerDocument.createTextNode(textContent)
}

module.exports = createTextNode
