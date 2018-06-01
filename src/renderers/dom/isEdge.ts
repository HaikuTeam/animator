/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function isEdge (window) {
  if (!window) {
    return false;
  }
  if (!window.navigator) {
    return false;
  }
  if (!window.navigator.userAgent) {
    return false;
  }
  return /Edge\/\d./i.test(window.navigator.userAgent);
}
