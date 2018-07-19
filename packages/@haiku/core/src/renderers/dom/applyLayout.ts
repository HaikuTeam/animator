/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import applyCssLayout from './../../layout/applyCssLayout';
import scopeOfElement from './../../layout/scopeOfElement';
import modernizr from './../../vendor/modernizr';
import getWindowsBrowserVersion from './getWindowsBrowserVersion';
import isEdge from './isEdge';
import isIE from './isIE';
import isMobile from './isMobile';
import isTextNode from './isTextNode';

const SVG = 'svg';

const safeWindow = typeof window !== 'undefined' && window;
const PLATFORM_INFO = {
  hasWindow: !!safeWindow,
  isMobile: isMobile(safeWindow), // Dumb navigator check
  isIE: isIE(safeWindow), // Dumb navigator check - use feature detection instead?
  isEdge: isEdge(safeWindow),
  windowsBrowserVersion: getWindowsBrowserVersion(safeWindow),
  hasPreserve3d: modernizr.hasPreserve3d(safeWindow), // I dunno if we actually need this
};

const SVG_RENDERABLES = {
  a: true,
  audio: true,
  canvas: true,
  circle: true,
  ellipse: true,
  filter: true,
  foreignObject: true,
  g: true,
  iframe: true,
  image: true,
  line: true,
  mesh: true,
  path: true,
  pattern: true,
  polygon: true,
  polyline: true,
  rect: true,
  svg: true,
  switch: true,
  symbol: true,
  text: true,
  textPath: true,
  tspan: true,
  unknown: true,
  use: true,
  video: true,
};

export default function applyLayout (
  domElement,
  virtualElement,
  parentDomNode,
  parentVirtualElement,
  component,
  isPatchOperation,
) {
  if (isTextNode(virtualElement)) {
    return domElement;
  }

  if (virtualElement.layout) {
    // Don't assign layout to things that never need it like <desc>, <title>, etc.
    // Check if we're inside an <svg> component *and* one of the actually renderable svg-type els
    if (
      scopeOfElement(virtualElement) === SVG &&
      !SVG_RENDERABLES[virtualElement.elementName]
    ) {
      return domElement;
    }

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
