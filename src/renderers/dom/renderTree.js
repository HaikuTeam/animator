/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var isBlankString = require('./isBlankString')
var removeElement = require('./removeElement')
var locatorBump = require('./locatorBump')
var addToHashTable = require('./addToHashTable')

function _cloneVirtualElement (virtualElement) {
  return {
    elementName: virtualElement.elementName,
    attributes: _cloneAttributes(virtualElement.attributes),
    children: virtualElement.children
  }
}

function _cloneAttributes (attributes) {
  if (!attributes) return {}
  var clone = {}
  for (var key in attributes) {
    clone[key] = attributes[key]
  }
  return clone
}

function renderTree (
  domElement,
  virtualElement,
  virtualChildren,
  locator,
  hash,
  options,
  scopes,
  isPatchOperation
) {
  addToHashTable(hash, domElement, virtualElement)

  if (!domElement.haiku) domElement.haiku = {}

  // 'hashtab', 'locator', and 'virtual' are more for debugging convenience than anything else.
  // E.g. I might want to inspect the dom node, grab the haiku source data, etc.
  domElement.haiku.hashtab = hash
  domElement.haiku.locator = locator
  domElement.haiku.virtual = virtualElement
  domElement.haiku.element = _cloneVirtualElement(virtualElement) // Must clone so we get a correct picture of differences in attributes between runs, e.g. for detecting attribute removals
  if (!options.cache[domElement.haiku.locator]) {
    options.cache[domElement.haiku.locator] = {}
  }

  if (!Array.isArray(virtualChildren)) {
    return domElement
  }

  while (virtualChildren.length > 0 && isBlankString(virtualChildren[0])) {
    virtualChildren.shift()
  }

  var max = virtualChildren.length
  if (max < domElement.childNodes.length) max = domElement.childNodes.length

  for (var i = 0; i < max; i++) {
    var virtualChild = virtualChildren[i]
    var domChild = domElement.childNodes[i]
    var sublocator = locatorBump(locator, i)

    if (virtualChild && options.modifier) {
      var virtualReplacement = options.modifier(virtualChild)
      if (virtualReplacement !== undefined) {
        virtualChild = virtualReplacement
      }
    }

    if (!virtualChild && !domChild) {
      continue
    } else if (!virtualChild && domChild) {
      removeElement(domChild, hash, options, scopes)
    } else if (virtualChild && !domChild) {
      var insertedElement = appendChild(
        null,
        virtualChild,
        domElement,
        virtualElement,
        sublocator,
        hash,
        options,
        scopes
      )

      addToHashTable(hash, insertedElement, virtualChild)
    } else {
      if (!domChild.haiku) domChild.haiku = {}
      domChild.haiku.locator = sublocator
      if (!options.cache[domChild.haiku.locator]) {
        options.cache[domChild.haiku.locator] = {}
      }

      if (!domChild.haiku.element) {
        // Must clone so we get a correct picture of differences in attributes between runs, e.g. for detecting attribute removals
        domChild.haiku.element = _cloneVirtualElement(virtualChild)
      }

      updateElement(
        domChild,
        virtualChild,
        domElement,
        virtualElement,
        sublocator,
        hash,
        options,
        scopes,
        isPatchOperation
      )
    }
  }

  return domElement
}

module.exports = renderTree

var appendChild = require('./appendChild')
var updateElement = require('./updateElement')
