/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var applyLayout = require('./applyLayout')
var assignAttributes = require('./assignAttributes')
var getTypeAsString = require('./getTypeAsString')
var _cloneVirtualElement = require('./cloneVirtualElement')

var OBJECT = 'object'
var STRING = 'string'

function updateElement (
  domElement,
  virtualElement,
  parentNode,
  parentVirtualElement,
  locator,
  component,
  isPatchOperation
) {
  // If a text node, go straight to 'replace' since we don't know the tag name
  if (isTextNode(virtualElement, component)) {
    replaceElementWithText(domElement, virtualElement, component)
    return virtualElement
  }

  if (!domElement.haiku) domElement.haiku = {}
  domElement.haiku.locator = locator
  if (!component.config.options.cache[domElement.haiku.locator]) {
    component.config.options.cache[domElement.haiku.locator] = {}
  }
  if (!domElement.haiku.element) {
    // Must clone so we get a correct picture of differences in attributes between runs, e.g. for detecting attribute removals
    domElement.haiku.element = _cloneVirtualElement(virtualElement)
  }

  var domTagName = domElement.tagName.toLowerCase().trim()
  var elName = normalizeName(getTypeAsString(virtualElement))
  var virtualElementTagName = elName.toLowerCase().trim()
  var incomingKey =
    virtualElement.key ||
    (virtualElement.attributes && virtualElement.attributes.key)
  var existingKey = domElement.haiku && domElement.haiku.key
  var isKeyDifferent =
    incomingKey !== null &&
    incomingKey !== undefined &&
    incomingKey !== existingKey

  // For so-called 'horizon' elements, we assume that we've ceded control to another renderer,
  // so the most we want to do is update the attributes and layout properties, but leave the rest alone
  if (!component._isHorizonElement(virtualElement)) {
    if (domTagName !== virtualElementTagName) {
      return replaceElement(
        domElement,
        virtualElement,
        parentNode,
        parentVirtualElement,
        locator,
        component
      )
    }

    if (isKeyDifferent) {
      return replaceElement(
        domElement,
        virtualElement,
        parentNode,
        parentVirtualElement,
        locator,
        component
      )
    }
  }

  if (
    virtualElement.attributes &&
    typeof virtualElement.attributes === OBJECT
  ) {
    assignAttributes(
      domElement,
      virtualElement,
      component,
      isPatchOperation,
      isKeyDifferent
    )
  }
  applyLayout(
    domElement,
    virtualElement,
    parentNode,
    parentVirtualElement,
    component,
    isPatchOperation,
    isKeyDifferent
  )
  if (incomingKey !== undefined && incomingKey !== null) {
    domElement.haiku.key = incomingKey
  }

  if (Array.isArray(virtualElement.children)) {
    // For performance, we don't render children during a patch operation, except in the case
    // that we have some text content, which we (hack) need to always assume needs an update.
    // TODO: Fix this hack and make smarter
    var doSkipChildren = isPatchOperation && (typeof virtualElement.children[0] !== STRING)
    renderTree(
      domElement,
      virtualElement,
      virtualElement.children,
      locator,
      component,
      isPatchOperation,
      doSkipChildren
    )
  } else if (!virtualElement.children) {
    // In case of falsy virtual children, we still need to remove elements that were already there
    renderTree(
      domElement,
      virtualElement,
      [],
      locator,
      component,
      isPatchOperation
    )
  }

  return domElement
}

module.exports = updateElement

var renderTree = require('./renderTree')
var replaceElementWithText = require('./replaceElementWithText')
var replaceElement = require('./replaceElement')
var normalizeName = require('./normalizeName')
var isTextNode = require('./isTextNode')
