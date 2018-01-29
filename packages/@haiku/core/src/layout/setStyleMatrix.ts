/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import formatTransform from './formatTransform';
import isEqualTransformString from './isEqualTransformString';

export default function setStyleMatrix(styleObject, format, matrix, usePrefix, devicePixelRatio) {
  const matrixString = formatTransform(matrix, format, devicePixelRatio);
  if (usePrefix) {
    if (!isEqualTransformString(styleObject.webkitTransform, matrixString)) {
      styleObject.webkitTransform = matrixString;
    }
  } else {
    if (!isEqualTransformString(styleObject.transform, matrixString)) {
      styleObject.transform = matrixString;
    }
  }
  return styleObject;
}
