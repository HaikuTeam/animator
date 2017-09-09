/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import applyLayout from "./applyLayout"
import createTagNode from "./createTagNode"
import createTextNode from "./createTextNode"
import isTextNode from "./isTextNode"

export default function appendChild(
  alreadyChildElement,
  virtualElement,
  parentDomElement,
  parentVirtualElement,
  component,
) {
  let domElementToInsert
  if (isTextNode(virtualElement)) {
    domElementToInsert = createTextNode(
      parentDomElement,
      virtualElement,
    )
  } else {
    domElementToInsert = createTagNode(
      parentDomElement,
      virtualElement,
      parentVirtualElement,
      component,
    )
  }

  applyLayout(
    domElementToInsert,
    virtualElement,
    parentDomElement,
    parentVirtualElement,
    component,
    null,
    null,
  )

  parentDomElement.appendChild(domElementToInsert)
  return domElementToInsert
}
