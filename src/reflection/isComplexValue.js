/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

function isComplexValue(value) {
  return (value && Array.isArray(value)) ||
    (value && typeof value === 'object');
}

module.exports = isComplexValue;
