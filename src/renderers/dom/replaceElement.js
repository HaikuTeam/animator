/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var applyLayout = require('./applyLayout')
var isTextNode = require('./isTextNode')

function replaceElement (
  domElement,
  virtualElement,
  parentDomNode,
  parentVirtualElement,
  locator,
  context
) {
  var newElement
  if (isTextNode(virtualElement)) {
    newElement = createTextNode(domElement, virtualElement, context)
  } else {
    newElement = createTagNode(
      domElement,
      virtualElement,
      parentVirtualElement,
      locator,
      context
    )
  }

  applyLayout(
    newElement,
    virtualElement,
    parentDomNode,
    parentVirtualElement,
    context
  )

  parentDomNode.replaceChild(newElement, domElement)
  return newElement
}

module.exports = replaceElement

var createTextNode = require('./createTextNode')
var createTagNode = require('./createTagNode')
