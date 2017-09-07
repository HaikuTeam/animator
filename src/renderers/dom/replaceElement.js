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
  component
) {
  var newElement
  if (isTextNode(virtualElement)) {
    newElement = createTextNode(domElement, virtualElement, component)
  } else {
    newElement = createTagNode(
      domElement,
      virtualElement,
      parentVirtualElement,
      component
    )
  }

  applyLayout(
    newElement,
    virtualElement,
    parentDomNode,
    parentVirtualElement,
    component
  )

  parentDomNode.replaceChild(newElement, domElement)
  return newElement
}

module.exports = replaceElement

var createTextNode = require('./createTextNode')
var createTagNode = require('./createTagNode')
