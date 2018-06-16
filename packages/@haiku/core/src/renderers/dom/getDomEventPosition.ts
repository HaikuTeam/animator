/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function getDomEventPosition (event, doc) {
  let x = -1;
  let y = -1;
  if (event.pageX || event.pageY) {
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
}
