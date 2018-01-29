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
  const flexId = getFlexId(virtualElement);

  let newDomElement;
  if (allSvgElementNames[tagName]) {
    // SVG
    newDomElement = createSvgElement(domElement, tagName);
  } else {
    // Normal DOM
    newDomElement = domElement.ownerDocument.createElement(tagName);
  }

  // This didn't happen in renderTree because the element didn't exist yet.
  if (!newDomElement.haiku) {
    newDomElement.haiku = {
      // This is used to detect whether the element's host component has changed.
      // Don't remove this without understanding the effect on Haiku.app.
      component,
    };
  }

  if (!component.cache[flexId]) {
    component.cache[flexId] = {};
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
