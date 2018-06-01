/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function createTextNode (domElement, textContent) {
  return domElement.ownerDocument.createTextNode(textContent);
}
