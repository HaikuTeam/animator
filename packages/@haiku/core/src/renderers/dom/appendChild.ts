/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import applyLayout from './applyLayout';
import createTagNode from './createTagNode';
import createTextNode from './createTextNode';
import isTextNode from './isTextNode';

export default function appendChild(
  alreadyChildElement,
  virtualElement,
  parentDomElement,
  parentVirtualElement,
  component,
) {
  const domElementToInsert = isTextNode(virtualElement)
    ? createTextNode(parentDomElement, virtualElement)
    : createTagNode(parentDomElement, virtualElement, parentVirtualElement, component);

  applyLayout(domElementToInsert, virtualElement, parentDomElement, parentVirtualElement, component, null);

  parentDomElement.appendChild(domElementToInsert);
  return domElementToInsert;
}
