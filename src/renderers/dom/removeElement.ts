/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import getFlexId from './getFlexId';

export default function removeElement(domElement, virtualElement, component) {
  if (component.cache[getFlexId(virtualElement)]) {
    component.cache[getFlexId(virtualElement)] = {};
  }

  domElement.parentNode.removeChild(domElement);
  return domElement;
}
