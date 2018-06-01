/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

export default function isIE (window) {
  if (!window) {
    return false;
  }
  if (!window.navigator) {
    return false;
  }
  if (!window.navigator.userAgent) {
    return false;
  }
  return (
    window.navigator.userAgent.indexOf('MSIE') !== -1 ||
    navigator.appVersion.indexOf('Trident') > 0
  );
}
