/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function assignClass (domElement, className) {
  if (domElement.className !== className) {
    domElement.setAttribute('class', className);
  }
  return domElement;
}
