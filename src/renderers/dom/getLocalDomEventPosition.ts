/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import getDomEventPosition from './getDomEventPosition';

export default function getLocalDomEventPosition (event, domElement) {
  const doc = domElement.ownerDocument;
  const viewPosition = getDomEventPosition(event, doc);
  const elementRect = domElement.getBoundingClientRect();
  const x = viewPosition.x - elementRect.left;
  const y = viewPosition.y - elementRect.top;
  return {
    x: ~~x,
    y: ~~y,
    pageX: viewPosition.x,
    pageY: viewPosition.y,
  };
}
