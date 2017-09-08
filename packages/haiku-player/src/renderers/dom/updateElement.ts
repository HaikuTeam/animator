/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let applyLayout = require("./applyLayout")
let assignAttributes = require("./assignAttributes")
let getTypeAsString = require("./getTypeAsString")
let cloneVirtualElement = require("./cloneVirtualElement")
let getFlexId = require("./getFlexId")

let OBJECT = "object"
let STRING = "string"

function updateElement(
  domElement,
  virtualElement,
  parentNode,
  parentVirtualElement,
  component,
  isPatchOperation,
) {
  // If a text node, go straight to 'replace' since we don't know the tag name
  if (isTextNode(virtualElement, component)) {
    replaceElementWithText(domElement, virtualElement, component)
    return virtualElement
  }

  if (!domElement.haiku) domElement.haiku = {}

  if (!component.config.options.cache[getFlexId(virtualElement)]) {
    component.config.options.cache[getFlexId(virtualElement)] = {}
  }

  if (!domElement.haiku.element) {
    // Must clone so we get a correct picture of differences in attributes between runs, e.g. for detecting attribute removals
    domElement.haiku.element = cloneVirtualElement(virtualElement)
  }

  let domTagName = domElement.tagName.toLowerCase().trim()
  let elName = normalizeName(getTypeAsString(virtualElement))
  let virtualElementTagName = elName.toLowerCase().trim()
  let incomingKey =
    virtualElement.key ||
    (virtualElement.attributes && virtualElement.attributes.key)
  let existingKey = domElement.haiku && domElement.haiku.key
  let isKeyDifferent =
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
        component,
      )
    }

    if (isKeyDifferent) {
      return replaceElement(
        domElement,
        virtualElement,
        parentNode,
        parentVirtualElement,
        component,
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
      isKeyDifferent,
    )
  }
  applyLayout(
    domElement,
    virtualElement,
    parentNode,
    parentVirtualElement,
    component,
    isPatchOperation,
    isKeyDifferent,
  )
  if (incomingKey !== undefined && incomingKey !== null) {
    domElement.haiku.key = incomingKey
  }

  let subcomponent = (virtualElement && virtualElement.__instance) || component

  if (Array.isArray(virtualElement.children)) {
    // For performance, we don't render children during a patch operation, except in the case
    // that we have some text content, which we (hack) need to always assume needs an update.
    // TODO: Fix this hack and make smarter
    let doSkipChildren = isPatchOperation && (typeof virtualElement.children[0] !== STRING)
    renderTree(
      domElement,
      virtualElement,
      virtualElement.children,
      subcomponent,
      isPatchOperation,
      doSkipChildren,
    )
  } else if (!virtualElement.children) {
    // In case of falsy virtual children, we still need to remove elements that were already there
    renderTree(
      domElement,
      virtualElement,
      [],
      subcomponent,
      isPatchOperation,
    )
  }

  return domElement
}

module.exports = updateElement

let renderTree = require("./renderTree")
let replaceElementWithText = require("./replaceElementWithText")
let replaceElement = require("./replaceElement")
let normalizeName = require("./normalizeName")
let isTextNode = require("./isTextNode")
