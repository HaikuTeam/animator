/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import createTextNode from './createTextNode';

export default function insertTextChild (domElement, index, textContent) {
  const existingChild = domElement.childNodes[index];

  // Don't do anything if the textContent is already equal
  if (existingChild && existingChild.textContent === textContent) {
    return domElement;
  }

  // If an domElement is already at this index, replace with a text node
  if (existingChild) {
    const textNode = createTextNode(domElement, textContent);
    domElement.replaceChild(textNode, existingChild);
    return domElement;
  }

  return domElement;
}
