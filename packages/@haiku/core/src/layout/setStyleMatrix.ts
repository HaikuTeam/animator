/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import formatTransform from './formatTransform';
import isEqualTransformString from './isEqualTransformString';

export default function setStyleMatrix (styleObject, format, matrix) {
  const matrixString = formatTransform(matrix, format);
  if (!isEqualTransformString(styleObject.transform, matrixString)) {
    styleObject.transform = matrixString;
  }
}
