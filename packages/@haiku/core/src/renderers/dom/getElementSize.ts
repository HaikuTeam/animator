/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function getElementSize (domElement) {
  const rect = domElement.getBoundingClientRect();
  return {
    x: rect.width,
    y: rect.height,
  };
}
