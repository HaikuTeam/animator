/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import applyLayout from "./applyLayout"
import isTextNode from "./isTextNode"
import createTextNode from "./createTextNode"
import createTagNode from "./createTagNode"

export default function replaceElement(
  domElement,
  virtualElement,
  parentDomNode,
  parentVirtualElement,
  component,
) {
  let newElement
  if (isTextNode(virtualElement)) {
    newElement = createTextNode(domElement, virtualElement)
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
    null,
    null
  )

  parentDomNode.replaceChild(newElement, domElement)
  return newElement
}
