/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import applyCssLayout from '../../layout/applyCssLayout';
import modernizr from '../../vendor/modernizr';
import getWindowsBrowserVersion from './getWindowsBrowserVersion';
import isEdge from './isEdge';
import isIE from './isIE';
import isMobile from './isMobile';
import isTextNode from './isTextNode';

const safeWindow = typeof window !== 'undefined' && window;
const PLATFORM_INFO = {
  hasWindow: !!safeWindow,
  isMobile: isMobile(safeWindow), // Dumb navigator check
  isIE: isIE(safeWindow), // Dumb navigator check - use feature detection instead?
  isEdge: isEdge(safeWindow),
  windowsBrowserVersion: getWindowsBrowserVersion(safeWindow),
  hasPreserve3d: modernizr.hasPreserve3d(safeWindow), // I dunno if we actually need this
};

export default function applyLayout (
  domElement,
  virtualElement,
  component,
) {
  if (isTextNode(virtualElement)) {
    return domElement;
  }

  if (virtualElement.layout) {
    const computedLayout = virtualElement.layout.computed;

    // No computed layout means the el is not shown
    if (!computedLayout) {
      if (domElement.style.display !== 'none') {
        domElement.style.display = 'none';
      }
    } else {
      if (domElement.style.display !== 'block') {
        domElement.style.display = 'block';
      }

      component.config.platform = PLATFORM_INFO;

      applyCssLayout(domElement, virtualElement, virtualElement.layout, computedLayout, component);
    }
  }

  return domElement;
}
