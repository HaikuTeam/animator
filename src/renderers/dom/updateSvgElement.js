var applyLayout = require('./applyLayout')
var assignAttributes = require('./assignAttributes')

var OBJECT = 'object'

function updateSvgElement (svgDomElement, elementName, attributes, virtualChildren, virtualElement, parentDomNode, parentVirtualElement, locator, hash, options, scopes) {
  applyLayout(svgDomElement, virtualElement, parentDomNode, parentVirtualElement, options, scopes)
  if (attributes && typeof attributes === OBJECT) assignAttributes(svgDomElement, attributes, options, scopes)
  if (Array.isArray(virtualChildren)) renderTree(svgDomElement, virtualElement, virtualChildren, locator, hash, options, scopes)
}

module.exports = updateSvgElement

var renderTree = require('./renderTree')
