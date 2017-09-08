/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var normalizeName = require('./normalizeName')
var getTypeAsString = require('./getTypeAsString')
var getFlexId = require('./getFlexId')

var SVG_EL_NAMES = require('./../../helpers/allSvgElementNames')

function createTagNode (
  domElement,
  virtualElement,
  parentVirtualElement,
  component
) {
  var tagName = normalizeName(getTypeAsString(virtualElement))
  var newDomElement
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

  var incomingKey =
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
    component
  )
  return newDomElement
}

module.exports = createTagNode

var createSvgElement = require('./createSvgElement')
var updateElement = require('./updateElement')
