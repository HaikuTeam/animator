/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var createTextNode = require('./createTextNode')
var createTagNode = require('./createTagNode')
var applyLayout = require('./applyLayout')
var isTextNode = require('./isTextNode')

function appendChild (
  alreadyChildElement,
  virtualElement,
  parentDomElement,
  parentVirtualElement,
  locator,
  context
) {
  var domElementToInsert
  if (isTextNode(virtualElement)) {
    domElementToInsert = createTextNode(
      parentDomElement,
      virtualElement,
      context
    )
  } else {
    domElementToInsert = createTagNode(
      parentDomElement,
      virtualElement,
      parentVirtualElement,
      locator,
      context
    )
  }

  applyLayout(
    domElementToInsert,
    virtualElement,
    parentDomElement,
    parentVirtualElement,
    context
  )

  parentDomElement.appendChild(domElementToInsert)
  return domElementToInsert
}

module.exports = appendChild
