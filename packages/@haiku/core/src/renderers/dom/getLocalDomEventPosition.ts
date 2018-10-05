/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

const getDomEventPosition = (event: MouseEvent, doc: HTMLDocument) => {
  let x = -1;
  let y = -1;
  if (event.hasOwnProperty('pageX')) {
    x = event.pageX;
    y = event.pageY;
  } else if (event.clientX || event.clientY) {
    x = event.clientX + doc.body.scrollLeft + doc.documentElement.scrollLeft;
    y = event.clientY + doc.body.scrollTop + doc.documentElement.scrollTop;
  }
  return {
    x: ~~x,
    y: ~~y,
  };
};

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
