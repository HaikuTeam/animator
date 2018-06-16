/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function isMobile (window) {
  if (!window) {
    return false;
  }
  if (!window.navigator) {
    return false;
  }
  if (!window.navigator.userAgent) {
    return false;
  }
  return /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
}
