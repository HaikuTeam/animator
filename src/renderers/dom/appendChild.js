var createTextNode = require('./createTextNode')
var createTagNode = require('./createTagNode')
var applyLayout = require('./applyLayout')
var isTextNode = require('./isTextNode')
var scopeAdjust = require('./scopeAdjust')

function appendChild (alreadyChildElement, virtualElement, parentDomElement, parentVirtualElement, locator, hash, options, scopes) {
  scopeAdjust(parentVirtualElement, parentDomElement, options, scopes)

  var domElementToInsert
  if (isTextNode(virtualElement, scopes)) domElementToInsert = createTextNode(parentDomElement, virtualElement, options, scopes)
  else domElementToInsert = createTagNode(parentDomElement, virtualElement, parentVirtualElement, locator, hash, options, scopes)

  applyLayout(domElementToInsert, virtualElement, parentDomElement, parentVirtualElement, options, scopes)

  parentDomElement.appendChild(domElementToInsert)
  return domElementToInsert
}

module.exports = appendChild
