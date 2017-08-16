/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var createTextNode = require('./createTextNode')

function replaceElementWithText (domElement, textContent, context) {
  if (domElement) {
    if (domElement.textContent !== textContent) {
      var parentNode = domElement.parentNode
      var textNode = createTextNode(domElement, textContent, context)
      parentNode.replaceChild(textNode, domElement)
    }
  }
  return domElement
}

module.exports = replaceElementWithText
