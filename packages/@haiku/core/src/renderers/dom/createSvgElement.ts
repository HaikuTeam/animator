/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export default function createSvgElement (domElement, tagName) {
  return domElement.ownerDocument.createElementNS(SVG_NAMESPACE, tagName);
}
