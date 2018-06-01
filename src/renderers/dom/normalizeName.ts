/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function normalizeName (tagName) {
  if (tagName[0] === tagName[0].toUpperCase()) {
    return tagName + '-component';
  }
  return tagName;
}
