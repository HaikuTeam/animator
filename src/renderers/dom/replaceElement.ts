/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import applyLayout from './applyLayout';
import createTagNode from './createTagNode';
import createTextNode from './createTextNode';
import isTextNode from './isTextNode';
import getFlexId from './getFlexId';

export default function replaceElement(
  domElement,
  virtualElement,
  parentDomNode,
  parentVirtualElement,
  component,
) {
  const flexId = getFlexId(virtualElement);

  if (component.cache[flexId]) {
    component.cache[flexId] = {};
  }

  const newElement = isTextNode(virtualElement)
    ? createTextNode(domElement, virtualElement)
    : createTagNode(domElement, virtualElement, parentVirtualElement, component);

  applyLayout(newElement, virtualElement, parentDomNode, parentVirtualElement, component, null);

  parentDomNode.replaceChild(newElement, domElement);
  return newElement;
}
