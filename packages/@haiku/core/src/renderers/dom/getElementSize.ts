/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function getElementSize (domElement) {
  // Get fractional size when on DOM
  if (domElement.getBoundingClientRect instanceof Function) {
    const rect = domElement.getBoundingClientRect();
    return {x: rect.width, y: rect.height};
  }

  // Fallback to rounded offsetWidth/offsetHeight
  if (domElement.offsetWidth !== undefined) {
    return {x: domElement.offsetWidth, y: domElement.offsetHeight};
  }

  return {x: 1, y: 1};
}
