var replaceElementWithText = require('./replaceElementWithText')
var replaceElement = require('./replaceElement')
var updateElement = require('./updateElement')
var normalizeName = require('./normalizeName')
var getTypeAsString = require('./getTypeAsString')
var isTextNode = require('./isTextNode')
var scopeAdjust = require('./scopeAdjust')

function modifyChild (domElement, virtualElement, parentDomNode, parentVirtualElement, locator, hash, options, scopes) {
  scopeAdjust(parentVirtualElement, parentDomNode, options, scopes)

  // If a text node, go straight to 'replace' since we don't know the tag name
  if (isTextNode(virtualElement, scopes)) {
    replaceElementWithText(domElement, virtualElement, options, scopes)
    return virtualElement
  }

  var domTagName = domElement.tagName.toLowerCase().trim()
  var elName = normalizeName(getTypeAsString(virtualElement))
  var virtualElementTagName = elName.toLowerCase().trim()

  if (domTagName !== virtualElementTagName) {
    return replaceElement(domElement, virtualElement, parentDomNode, parentVirtualElement, locator, hash, options, scopes)
  }

  updateElement(domElement, virtualElement, parentDomNode, parentVirtualElement, locator, hash, options, scopes)

  return domElement
}

module.exports = modifyChild
