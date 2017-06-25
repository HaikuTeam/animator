/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function assignClass (domElement, className, options, scopes) {
  if (domElement.className !== className) {
    domElement.className = className
  }
  return domElement
}

module.exports = assignClass
