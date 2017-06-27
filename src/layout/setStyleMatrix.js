/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var formatTransform = require('./formatTransform')
var isEqualTransformString = require('./isEqualTransformString')

function setStyleMatrix (
  styleObject,
  format,
  matrix,
  usePrefix,
  devicePixelRatio,
  rendererScopes
) {
  var matrixString = formatTransform(matrix, format, devicePixelRatio)
  if (usePrefix) {
    if (!isEqualTransformString(styleObject.webkitTransform, matrixString)) {
      styleObject.webkitTransform = matrixString
    }
  } else {
    if (!isEqualTransformString(styleObject.transform, matrixString)) {
      styleObject.transform = matrixString
    }
  }
  return styleObject
}

module.exports = setStyleMatrix
