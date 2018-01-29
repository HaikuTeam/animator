/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import appendChild from './appendChild';
import cloneVirtualElement from './cloneVirtualElement';
import getFlexId from './getFlexId';
import isBlankString from './isBlankString';
import removeElement from './removeElement';
import replaceElement from './replaceElement';
import shouldElementBeReplaced from './shouldElementBeReplaced';
import updateElement from './updateElement';

export default function renderTree(
  domElement,
  virtualElement,
  virtualChildren,
  component,
  isPatchOperation,
  doSkipChildren,
) {
  const flexId = getFlexId(virtualElement);

  component._addElementToHashTable(domElement, virtualElement);

  if (!domElement.haiku) {
    domElement.haiku = {
      // This is used to detect whether the element's host component has changed.
      // Don't remove this without understanding the effect on Haiku.app.
      component,
    };
  }

  // E.g. I might want to inspect the dom node, grab the haiku source data, etc.
  virtualElement.__target = domElement;
  domElement.haiku.virtual = virtualElement;
  // Must clone so we get a correct picture of differences in attributes between runs, e.g. for detecting attribute
  // removals
  domElement.haiku.element = cloneVirtualElement(virtualElement);
  if (!component.cache[flexId]) {
    component.cache[flexId] = {};
  }

  if (!Array.isArray(virtualChildren)) {
    return domElement;
  }

  // For so-called 'horizon' elements, we assume that we've ceded control to another renderer,
  // so the most we want to do is update the attributes and layout properties, but leave the rest alone
  if (component._isHorizonElement(virtualElement)) {
    return domElement;
  }

  // During patch renders we don't want to drill down and update children as
  // we're just going to end up doing a lot of unnecessary DOM writes
  if (doSkipChildren) {
    return domElement;
  }

  while (virtualChildren.length > 0 && isBlankString(virtualChildren[0])) {
    virtualChildren.shift();
  }

  // Store a copy of the array here, otherwise we can hit a race where as we remove
  // elements from the DOM, the childNodes array gets shifted and the indices get offset, leading
  // to removals not occurring properly
  const domChildNodes = [];
  for (let k = 0; k < domElement.childNodes.length; k++) {
    domChildNodes[k] = domElement.childNodes[k];
  }

  let max = virtualChildren.length;
  if (max < domChildNodes.length) {
    max = domChildNodes.length;
  }

  for (let i = 0; i < max; i++) {
    const virtualChild = virtualChildren[i];
    const domChild = domChildNodes[i];

    if (!virtualChild && !domChild) {
      // empty
    } else if (!virtualChild && domChild) {
      removeElement(domChild, flexId, component);
    } else if (virtualChild) {
      if (!domChild) {
        const insertedElement = appendChild(null, virtualChild, domElement, virtualElement, component);
        component._addElementToHashTable(insertedElement, virtualChild);
      } else {
        // Circumstances in which we want to completely *replace* the element:
        // - We see that our cached target element is not the one at this location
        // - We see that the DOM id doesn't match the incoming one
        // - we see that the haiku-id doesn't match the incoming one.
        // If we now have an element that is different, we need to trigger a full re-render
        // of itself and all of its children, because e.g. url(#...) references will retain pointers to
        // old elements and this is the only way to clear the DOM to get a correct render.
        if (shouldElementBeReplaced(domChild, virtualChild, component)) {
          replaceElement(domChild, virtualChild, domElement, virtualElement, component);
        } else {
          updateElement(domChild, virtualChild, domElement, virtualElement, component, isPatchOperation);
        }
      }
    }
  }

  return domElement;
}
