/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let formatTransform = require("./formatTransform")
let isEqualTransformString = require("./isEqualTransformString")

function setStyleMatrix(
  styleObject,
  format,
  matrix,
  usePrefix,
  devicePixelRatio,
) {
  let matrixString = formatTransform(matrix, format, devicePixelRatio)
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
