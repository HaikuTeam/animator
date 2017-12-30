/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import applyLayout from './applyLayout';
import assignAttributes from './assignAttributes';
import cloneVirtualElement from './cloneVirtualElement';
import getFlexId from './getFlexId';
import getTypeAsString from './getTypeAsString';
import isTextNode from './isTextNode';
import normalizeName from './normalizeName';
import renderTree from './renderTree';
import replaceElement from './replaceElement';
import replaceElementWithText from './replaceElementWithText';

export default function updateElement(
  domElement,
  virtualElement,
  parentNode,
  parentVirtualElement,
  component,
  isPatchOperation,
) {
  const flexId = getFlexId(virtualElement);

  // If a text node, go straight to 'replace' since we don't know the tag name
  if (isTextNode(virtualElement)) {
    replaceElementWithText(domElement, virtualElement, component);
    return virtualElement;
  }

  if (!domElement.haiku) {
    domElement.haiku = {
      // This is used to detect whether the element's host component has changed.
      // Don't remove this without understanding the effect on Haiku.app.
      component,
    };
  }

  if (!component.cache[flexId]) {
    component.cache[flexId] = {};
  }

  if (!domElement.haiku.element) {
    // Must clone so we get a correct picture of differences in attributes between runs, e.g. for detecting attribute
    // removals
    domElement.haiku.element = cloneVirtualElement(virtualElement);
  }

  const domTagName = domElement.tagName.toLowerCase().trim();
  const elName = normalizeName(getTypeAsString(virtualElement));
  const virtualElementTagName = elName.toLowerCase().trim();
  const incomingKey = virtualElement.key || (virtualElement.attributes && virtualElement.attributes.key);
  const existingKey = domElement.haiku && domElement.haiku.key;
  const isKeyDifferent = incomingKey !== null && incomingKey !== undefined && incomingKey !== existingKey;

  // For so-called 'horizon' elements, we assume that we've ceded control to another renderer,
  // so the most we want to do is update the attributes and layout properties, but leave the rest alone
  if (!component._isHorizonElement(virtualElement)) {
    if (domTagName !== virtualElementTagName) {
      return replaceElement(domElement, virtualElement, parentNode, parentVirtualElement, component);
    }

    if (isKeyDifferent) {
      return replaceElement(domElement, virtualElement, parentNode, parentVirtualElement, component);
    }
  }

  if (virtualElement.attributes && typeof virtualElement.attributes === 'object') {
    assignAttributes(domElement, virtualElement, component, isPatchOperation);
  }

  applyLayout(domElement, virtualElement, parentNode, parentVirtualElement, component, isPatchOperation);
  if (incomingKey !== undefined && incomingKey !== null) {
    domElement.haiku.key = incomingKey;
  }

  const subcomponent = (virtualElement && virtualElement.__instance) || component;

  if (Array.isArray(virtualElement.children)) {
    // For performance, we don't render children during a patch operation, except in the case
    // that we have some text content, which we (hack) need to always assume needs an update.
    // TODO: Fix this hack and make smarter
    const doSkipChildren = isPatchOperation && (typeof virtualElement.children[0] !== 'string');
    renderTree(domElement, virtualElement, virtualElement.children, subcomponent, isPatchOperation, doSkipChildren);
  } else if (!virtualElement.children) {
    // In case of falsy virtual children, we still need to remove elements that were already there
    renderTree(domElement, virtualElement, [], subcomponent, isPatchOperation, null);
  }

  return domElement;
}
