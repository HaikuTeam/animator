/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let normalizeName = require("./normalizeName")
let getTypeAsString = require("./getTypeAsString")
let getFlexId = require("./getFlexId")

let SVG_EL_NAMES = require("./../../helpers/allSvgElementNames")

function createTagNode(
  domElement,
  virtualElement,
  parentVirtualElement,
  component,
) {
  let tagName = normalizeName(getTypeAsString(virtualElement))
  let newDomElement
  if (SVG_EL_NAMES[tagName]) {
    // SVG
    newDomElement = createSvgElement(domElement, tagName, component)
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
  )
  return newDomElement
}

module.exports = createTagNode

let createSvgElement = require("./createSvgElement")
let updateElement = require("./updateElement")
