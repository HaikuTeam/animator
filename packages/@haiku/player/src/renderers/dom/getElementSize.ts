/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

export default function getElementSize(domElement) {
  let x;
  let y;
  if (domElement.offsetWidth === undefined) {
    const rect = domElement.getBoundingClientRect();
    x = rect.width;
    y = rect.height;
  } else {
    x = domElement.offsetWidth;
    y = domElement.offsetHeight;
  }
  return {
    x,
    y,
  };
}
