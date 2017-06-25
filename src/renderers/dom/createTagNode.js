/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var normalizeName = require('./normalizeName')
var isSvgElementName = require('./isSvgElementName')
var getTypeAsString = require('./getTypeAsString')

function createTagNode (domElement, virtualElement, parentVirtualElement, locator, hash, options, scopes) {
  var tagName = normalizeName(getTypeAsString(virtualElement))
  var newDomElement
  if (isSvgElementName(tagName, scopes)) {
    // SVG
    newDomElement = createSvgElement(domElement, tagName, options, scopes)
  } else {
    // Normal DOM
    newDomElement = domElement.ownerDocument.createElement(tagName)
  }

  newDomElement.haiku = {}

  var incomingKey = virtualElement.key || virtualElement.attributes && virtualElement.attributes.key
  if (incomingKey !== undefined && incomingKey !== null) newDomElement.haiku.key = incomingKey

  updateElement(newDomElement, virtualElement, domElement, parentVirtualElement, locator, hash, options, scopes)
  return newDomElement
}

module.exports = createTagNode

var createSvgElement = require('./createSvgElement')
var updateElement = require('./updateElement')
