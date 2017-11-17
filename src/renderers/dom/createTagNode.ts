/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import allSvgElementNames from './../../helpers/allSvgElementNames';
import createSvgElement from './createSvgElement';
import getFlexId from './getFlexId';
import getTypeAsString from './getTypeAsString';
import normalizeName from './normalizeName';
import updateElement from './updateElement';

export default function createTagNode(
  domElement,
  virtualElement,
  parentVirtualElement,
  component,
) {
  const tagName = normalizeName(getTypeAsString(virtualElement));
  let newDomElement;
  if (allSvgElementNames[tagName]) {
    // SVG
    newDomElement = createSvgElement(domElement, tagName);
  } else {
    // Normal DOM
    newDomElement = domElement.ownerDocument.createElement(tagName);
  }

  // This doesn't happen in renderTree because the element doesn't exist yet.
  if (!newDomElement.haiku) {
    newDomElement.haiku = {};
  }

  if (!component.cache[getFlexId(virtualElement)]) {
    component.cache[getFlexId(virtualElement)] = {};
  }

  const incomingKey =
    virtualElement.key ||
    (virtualElement.attributes && virtualElement.attributes.key);
  if (incomingKey !== undefined && incomingKey !== null) {
    newDomElement.haiku.key = incomingKey;
  }

  // updateElement recurses down into setAttributes, etc.
  updateElement(newDomElement, virtualElement, domElement, parentVirtualElement, component, null);
  return newDomElement;
}
