var applyLayout = require('./applyLayout')
var assignAttributes = require('./assignAttributes')
var isSvgElementName = require('./isSvgElementName')
var getTypeAsString = require('./getTypeAsString')

var OBJECT = 'object'

function updateElement (domElement, virtualElement, parentNode, parentVirtualElement, locator, hash, options, scopes) {
  var name = getTypeAsString(virtualElement)
  var attrs = virtualElement.attributes
  var virtualChildren = virtualElement.children

  if (isSvgElementName(name, scopes)) {
    updateSvgElement(domElement, name, attrs, virtualChildren, virtualElement, parentNode, parentVirtualElement, locator, hash, options, scopes)
    return domElement
  }

  applyLayout(domElement, virtualElement, parentNode, parentVirtualElement, options, scopes)

  if (attrs && typeof attrs === OBJECT) assignAttributes(domElement, attrs, options, scopes)

  if (Array.isArray(virtualChildren)) {
    renderTree(domElement, virtualElement, virtualChildren, locator, hash, options, scopes)
  } else if (!virtualChildren) {
    // In case of falsy virtual children, we still need to remove elements that were already there
    renderTree(domElement, virtualElement, [], locator, hash, options, scopes)
  }

  return domElement
}

module.exports = updateElement

var renderTree = require('./renderTree')
var updateSvgElement = require('./updateSvgElement')
