/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

export default function isComplexValue(value) {
  return (value && Array.isArray(value)) || (value && typeof value === 'object');
}
