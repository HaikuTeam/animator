var applyLayout = require('./applyLayout')
var assignAttributes = require('./assignAttributes')
var isSvgElementName = require('./isSvgElementName')
var getTypeAsString = require('./getTypeAsString')

var OBJECT = 'object'

function updateElement (domElement, virtualElement, parentNode, parentVirtualElement, locator, hash) {
  const name = getTypeAsString(virtualElement)
  const attrs = virtualElement.attributes
  const virtualChildren = virtualElement.children

  if (isSvgElementName(name)) {
    updateSvgElement(domElement, name, attrs, virtualChildren, virtualElement, parentNode, parentVirtualElement, locator, hash)
    return domElement
  }

  applyLayout(domElement, virtualElement, parentNode, parentVirtualElement)

  if (attrs && typeof attrs === OBJECT) assignAttributes(domElement, attrs)

  if (Array.isArray(virtualChildren)) {
    renderTree(domElement, virtualElement, virtualChildren, locator, hash)
  }

  return domElement
}

module.exports = updateElement

var renderTree = require('./renderTree')
var updateSvgElement = require('./updateSvgElement')
