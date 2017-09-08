/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let createTextNode = require("./createTextNode")
let createTagNode = require("./createTagNode")
let applyLayout = require("./applyLayout")
let isTextNode = require("./isTextNode")

function appendChild(
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
      component,
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
  )

  parentDomElement.appendChild(domElementToInsert)
  return domElementToInsert
}

module.exports = appendChild
