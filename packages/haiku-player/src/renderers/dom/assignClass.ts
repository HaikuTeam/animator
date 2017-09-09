/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

export default function assignClass(domElement, className) {
  if (domElement.className !== className) {
    domElement.className = className
  }
  return domElement
}
