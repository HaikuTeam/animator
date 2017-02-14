var applyLayout = require('./applyLayout')
var assignAttributes = require('./assignAttributes')

var OBJECT = 'object'

function updateSvgElement (svgDomElement, elementName, attributes, virtualChildren, virtualElement, parentDomNode, parentVirtualElement, locator, hash) {
  applyLayout(svgDomElement, virtualElement, parentDomNode, parentVirtualElement)
  if (attributes && typeof attributes === OBJECT) assignAttributes(svgDomElement, attributes)
  if (Array.isArray(virtualChildren)) renderTree(svgDomElement, virtualElement, virtualChildren, locator, hash)
}

module.exports = updateSvgElement

var renderTree = require('./renderTree')
