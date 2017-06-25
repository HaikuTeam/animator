/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var createTextNode = require('./createTextNode')
var createTagNode = require('./createTagNode')
var applyLayout = require('./applyLayout')
var isTextNode = require('./isTextNode')

function appendChild (alreadyChildElement, virtualElement, parentDomElement, parentVirtualElement, locator, hash, options, scopes) {
  var domElementToInsert
  if (isTextNode(virtualElement, scopes)) domElementToInsert = createTextNode(parentDomElement, virtualElement, options, scopes)
  else domElementToInsert = createTagNode(parentDomElement, virtualElement, parentVirtualElement, locator, hash, options, scopes)

  applyLayout(domElementToInsert, virtualElement, parentDomElement, parentVirtualElement, options, scopes)

  parentDomElement.appendChild(domElementToInsert)
  return domElementToInsert
}

module.exports = appendChild
