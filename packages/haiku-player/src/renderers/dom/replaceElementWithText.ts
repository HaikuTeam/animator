/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let createTextNode = require("./createTextNode")

function replaceElementWithText(domElement, textContent, component) {
  if (domElement) {
    if (domElement.textContent !== textContent) {
      let parentNode = domElement.parentNode
      let textNode = createTextNode(domElement, textContent, component)
      parentNode.replaceChild(textNode, domElement)
    }
  }
  return domElement
}

module.exports = replaceElementWithText
