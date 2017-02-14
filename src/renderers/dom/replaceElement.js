var createTextNode = require('./createTextNode')
var createTagNode = require('./createTagNode')
var applyLayout = require('./applyLayout')
var isTextNode = require('./isTextNode')

function replaceElement (domElement, virtualElement, parentDomNode, parentVirtualElement, locator, hash) {
  var newElement
  if (isTextNode(virtualElement)) newElement = createTextNode(domElement, virtualElement)
  else newElement = createTagNode(domElement, virtualElement, parentVirtualElement, locator, hash)

  applyLayout(newElement, virtualElement, parentDomNode, parentVirtualElement)

  parentDomNode.replaceChild(newElement, domElement)
  return newElement
}

module.exports = replaceElement
