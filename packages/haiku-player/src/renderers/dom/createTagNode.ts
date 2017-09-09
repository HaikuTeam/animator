/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import SVG_EL_NAMES from "./../../helpers/allSvgElementNames"
import createSvgElement from "./createSvgElement"
import getFlexId from "./getFlexId"
import getTypeAsString from "./getTypeAsString"
import normalizeName from "./normalizeName"
import updateElement from "./updateElement"

export default function createTagNode(
  domElement,
  virtualElement,
  parentVirtualElement,
  component,
) {
  let tagName = normalizeName(getTypeAsString(virtualElement))
  let newDomElement
  if (SVG_EL_NAMES[tagName]) {
    // SVG
    newDomElement = createSvgElement(domElement, tagName)
  } else {
    // Normal DOM
    newDomElement = domElement.ownerDocument.createElement(tagName)
  }

  // This doesn't happen in renderTree because the element doesn't exist yet.
  if (!newDomElement.haiku) newDomElement.haiku = {}

  if (!component.config.options.cache[getFlexId(virtualElement)]) {
    component.config.options.cache[getFlexId(virtualElement)] = {}
  }

  let incomingKey =
    virtualElement.key ||
    (virtualElement.attributes && virtualElement.attributes.key)
  if (incomingKey !== undefined && incomingKey !== null) {
    newDomElement.haiku.key = incomingKey
  }

  // epdateElement recurses down into setAttributes, etc.
  updateElement(
    newDomElement,
    virtualElement,
    domElement,
    parentVirtualElement,
    component,
    null,
  )
  return newDomElement
}
