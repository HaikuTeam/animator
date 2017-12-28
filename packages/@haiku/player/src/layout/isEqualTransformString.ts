/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

// var CIDENT = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'

const C1 = ', ';

export default function isEqualTransformString(t1, t2) {
  if (t1 === t2) {
    return true;
  }

  if (!t1) {
    return false;
  }

  const cs1 = t1.split(C1);
  const cs2 = t2.split(C1);

  return !(cs1[0] !== cs2[0] || cs1[1] !== cs2[1] || cs1[2] !== cs2[2] || cs1[3] !== cs2[3] || cs1[4] !== cs2[4] ||
    cs1[5] !== cs2[5] || cs1[6] !== cs2[6] || cs1[7] !== cs2[7] || cs1[8] !== cs2[8] || cs1[9] !== cs2[9] ||
    cs1[10] !== cs2[10] || cs1[11] !== cs2[11] || cs1[12] !== cs2[12] || cs1[13] !== cs2[13] || cs1[14] !== cs2[14] ||
    cs1[15] !== cs2[15]);
}
