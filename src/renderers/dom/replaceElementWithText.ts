/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import createTextNode from './createTextNode';

export default function replaceElementWithText (domElement, textContent, component) {
  if (domElement) {
    if (domElement.textContent !== textContent) {
      const parentNode = domElement.parentNode;
      const textNode = createTextNode(domElement, textContent);
      parentNode.replaceChild(textNode, domElement);
    }
  }
  return domElement;
}
