/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var createTextNode = require('./createTextNode');

function replaceElementWithText(domElement, textContent, options, scopes) {
  if (domElement) {
    if (domElement.textContent !== textContent) {
      var parentNode = domElement.parentNode;
      var textNode = createTextNode(domElement, textContent, options, scopes);
      parentNode.replaceChild(textNode, domElement);
    }
  }
  return domElement;
}

module.exports = replaceElementWithText;
