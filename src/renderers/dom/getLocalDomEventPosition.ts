/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import getDomEventPosition from './getDomEventPosition';

export default (event: MouseEvent, domElement: HTMLElement) => {
  const doc = domElement.ownerDocument;
  const viewPosition = getDomEventPosition(event, doc);
  const elementRect = domElement.getBoundingClientRect();
  let x = viewPosition.x - elementRect.left;
  let y = viewPosition.y - elementRect.top;
  if (domElement.offsetWidth !== elementRect.width) {
    x *= domElement.offsetWidth / elementRect.width;
  }
  if (domElement.offsetHeight !== elementRect.height) {
    y *= domElement.offsetHeight / elementRect.height;
  }
  return {
    x,
    y,
    pageX: viewPosition.x,
    pageY: viewPosition.y,
  };
};
