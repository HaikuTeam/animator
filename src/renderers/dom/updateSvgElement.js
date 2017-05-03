var applyLayout = require('./applyLayout')
var assignAttributes = require('./assignAttributes')

var OBJECT = 'object'

function updateSvgElement (svgDomElement, elementName, attributes, virtualChildren, virtualElement, parentDomNode, parentVirtualElement, locator, hash, options, scopes, isPatchOperation, isKeyDifferent) {
  if (attributes && typeof attributes === OBJECT) assignAttributes(svgDomElement, attributes, options, scopes, isPatchOperation, isKeyDifferent)
  applyLayout(svgDomElement, virtualElement, parentDomNode, parentVirtualElement, options, scopes, isPatchOperation, isKeyDifferent)
  if (Array.isArray(virtualChildren)) renderTree(svgDomElement, virtualElement, virtualChildren, locator, hash, options, scopes, isPatchOperation)
}

module.exports = updateSvgElement

var renderTree = require('./renderTree')
