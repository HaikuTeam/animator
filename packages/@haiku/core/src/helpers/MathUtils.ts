/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

function degreesToRadians (d) {
  return d * Math.PI / 180;
}

function radiansToDegrees (r) {
  return r * 180 / Math.PI;
}

function anglesOfTriangle (sa, sb, sc) {
  const cosa = (sb * sb + sc * sc - sa * sa) / (2 * sb * sc);
  const cosb = (sc * sc + sa * sa - sb * sb) / (2 * sc * sa);
  const cosc = (sa * sa + sb * sb - sc * sc) / (2 * sa * sb);
  return [Math.acos(cosb), Math.acos(cosc), Math.acos(cosa)];
}

function hypotenuseValue (a, b) {
  return Math.sqrt(a * a + b * b);
}

export default {
  degreesToRadians,
  radiansToDegrees,
  anglesOfTriangle,
  hypotenuseValue,
};
