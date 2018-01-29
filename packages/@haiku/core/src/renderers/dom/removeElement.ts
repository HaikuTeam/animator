/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

export default function removeElement(domElement, flexId, component) {
  if (component.cache[flexId]) {
    component.cache[flexId] = {};
  }

  domElement.parentNode.removeChild(domElement);
  return domElement;
}
