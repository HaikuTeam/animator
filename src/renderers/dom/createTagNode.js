var normalizeName = require('./normalizeName')
var isSvgElementName = require('./isSvgElementName')
var createSvgElement = require('./createSvgElement')
var updateElement = require('./updateElement')
var getTypeAsString = require('./getTypeAsString')

function createTagNode (domElement, virtualElement, parentVirtualElement, locator, hash) {
  const tagName = normalizeName(getTypeAsString(virtualElement))
  let newDomElement
  if (isSvgElementName(tagName)) {
    // SVG
    newDomElement = createSvgElement(domElement, tagName)
  } else {
    // Normal DOM
    newDomElement = domElement.ownerDocument.createElement(tagName)
  }
  updateElement(newDomElement, virtualElement, domElement, parentVirtualElement, locator, hash)
  return newDomElement
}

module.exports = createTagNode
