/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function getElementSize (domElement) {
  var x
  var y
  if (domElement.offsetWidth === undefined) {
    var rect = domElement.getBoundingClientRect()
    x = rect.width
    y = rect.height
  } else {
    x = domElement.offsetWidth
    y = domElement.offsetHeight
  }
  return {
    x: x,
    y: y
  }
}

module.exports = getElementSize
