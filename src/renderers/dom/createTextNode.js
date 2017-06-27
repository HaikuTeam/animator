/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function createTextNode(domElement, textContent, options, scopes) {
  return domElement.ownerDocument.createTextNode(textContent);
}

module.exports = createTextNode;
