/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import formatTransform from './formatTransform';

export default function setStyleMatrix (domElement, format, matrix) {
  const matrixString = formatTransform(matrix, format);
  if (matrixString !== domElement.haiku.cachedTransform) {
    domElement.haiku.cachedTransform = domElement.style.transform = matrixString;
  }
}
