/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

export default function createTextNode(domElement, textContent) {
  return domElement.ownerDocument.createTextNode(textContent)
}
