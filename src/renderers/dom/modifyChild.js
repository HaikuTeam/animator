var replaceElementWithText = require('./replaceElementWithText')
var replaceElement = require('./replaceElement')
var updateElement = require('./updateElement')
var normalizeName = require('./normalizeName')
var getTypeAsString = require('./getTypeAsString')
var isTextNode = require('./isTextNode')

function modifyChild (domElement, virtualElement, parentDomNode, parentVirtualElement, locator, hash) {
  // If a text node, go straight to 'replace' since we don't know the tag name
  if (isTextNode(virtualElement)) {
    replaceElementWithText(domElement, virtualElement)
    return virtualElement
  }

  const domTagName = domElement.tagName.toLowerCase().trim()
  const elName = normalizeName(getTypeAsString(virtualElement))
  const virtualElementTagName = elName.toLowerCase().trim()

  if (domTagName !== virtualElementTagName) {
    return replaceElement(domElement, virtualElement, parentDomNode, parentVirtualElement, locator, hash)
  }

  updateElement(domElement, virtualElement, parentDomNode, parentVirtualElement, locator, hash)

  return domElement
}

module.exports = modifyChild
