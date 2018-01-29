/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {transformValueIsEssentiallyInt} from './transformValueIsEssentiallyInt';

export const isMatrixableTransformArray = (transform) => {
  return transformValueIsEssentiallyInt(transform[2], 0) &&
    transformValueIsEssentiallyInt(transform[3], 0) &&
    transformValueIsEssentiallyInt(transform[6], 0) &&
    transformValueIsEssentiallyInt(transform[7], 0) &&
    transformValueIsEssentiallyInt(transform[8], 0) &&
    transformValueIsEssentiallyInt(transform[9], 0) &&
    transformValueIsEssentiallyInt(transform[10], 1) &&
    transformValueIsEssentiallyInt(transform[11], 0) &&
    transformValueIsEssentiallyInt(transform[14], 0) &&
    transformValueIsEssentiallyInt(transform[15], 1);
};
