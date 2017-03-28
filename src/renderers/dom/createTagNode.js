var normalizeName = require('./normalizeName')
var isSvgElementName = require('./isSvgElementName')
var createSvgElement = require('./createSvgElement')
var updateElement = require('./updateElement')
var getTypeAsString = require('./getTypeAsString')

function createTagNode (domElement, virtualElement, parentVirtualElement, locator, hash, options, scopes) {
  var tagName = normalizeName(getTypeAsString(virtualElement))
  var newDomElement
  if (isSvgElementName(tagName, scopes)) {
    // SVG
    newDomElement = createSvgElement(domElement, tagName, options, scopes)
  } else {
    // Normal DOM
    newDomElement = domElement.ownerDocument.createElement(tagName)
  }
  updateElement(newDomElement, virtualElement, domElement, parentVirtualElement, locator, hash, options, scopes)
  return newDomElement
}

module.exports = createTagNode
