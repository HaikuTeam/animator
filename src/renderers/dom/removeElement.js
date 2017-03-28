function removeElement (domElement, hash, options, scopes) {
  domElement.parentNode.removeChild(domElement)
  return domElement
}

module.exports = removeElement
