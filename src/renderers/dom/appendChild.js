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
  component
) {
  var domElementToInsert
  if (isTextNode(virtualElement)) {
    domElementToInsert = createTextNode(
      parentDomElement,
      virtualElement,
      component
    )
  } else {
    domElementToInsert = createTagNode(
      parentDomElement,
      virtualElement,
      parentVirtualElement,
      locator,
      component
    )
  }

  applyLayout(
    domElementToInsert,
    virtualElement,
    parentDomElement,
    parentVirtualElement,
    component
  )

  parentDomElement.appendChild(domElementToInsert)
  return domElementToInsert
}

module.exports = appendChild
