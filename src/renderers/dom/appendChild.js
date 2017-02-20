var createTextNode = require('./createTextNode')
var createTagNode = require('./createTagNode')
var applyLayout = require('./applyLayout')
var isTextNode = require('./isTextNode')

function appendChild (domElement, virtualElement, parentVirtualElement, locator, hash) {
  var domElementToInsert
  if (isTextNode(virtualElement)) domElementToInsert = createTextNode(domElement, virtualElement)
  else domElementToInsert = createTagNode(domElement, virtualElement, parentVirtualElement, locator, hash)

  applyLayout(domElementToInsert, virtualElement, domElement, parentVirtualElement)

  domElement.appendChild(domElementToInsert)
  return domElementToInsert
}

module.exports = appendChild
