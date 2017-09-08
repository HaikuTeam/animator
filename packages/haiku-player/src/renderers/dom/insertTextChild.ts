/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let createTextNode = require("./createTextNode")

function insertTextChild(domElement, index, textContent) {
  let existingChild = domElement.childNodes[index]

  // Don't do anything if the textContent is already equal
  if (existingChild && existingChild.textContent === textContent) {
    return domElement
  }

  // If an domElement is already at this index, replace with a text node
  if (existingChild) {
    let textNode = createTextNode(domElement, textContent)
    domElement.replaceChild(textNode, existingChild)
    return domElement
  }

  return domElement
}

module.exports = insertTextChild
