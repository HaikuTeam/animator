/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let applyLayout = require("./applyLayout")
let isTextNode = require("./isTextNode")

function replaceElement(
  domElement,
  virtualElement,
  parentDomNode,
  parentVirtualElement,
  component,
) {
  let newElement
  if (isTextNode(virtualElement)) {
    newElement = createTextNode(domElement, virtualElement, component)
  } else {
    newElement = createTagNode(
      domElement,
      virtualElement,
      parentVirtualElement,
      component,
    )
  }

  applyLayout(
    newElement,
    virtualElement,
    parentDomNode,
    parentVirtualElement,
    component,
  )

  parentDomNode.replaceChild(newElement, domElement)
  return newElement
}

module.exports = replaceElement

let createTextNode = require("./createTextNode")
let createTagNode = require("./createTagNode")
