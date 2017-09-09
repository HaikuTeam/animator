/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

// var CIDENT = 'matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)'

let C1 = ", "

export default function isEqualTransformString(t1, t2) {
  if (t1 === t2) return true

  if (!t1) return false

  let cs1 = t1.split(C1)
  let cs2 = t2.split(C1)

  if (cs1[0] !== cs2[0]) return false
  if (cs1[1] !== cs2[1]) return false
  if (cs1[2] !== cs2[2]) return false
  if (cs1[3] !== cs2[3]) return false
  if (cs1[4] !== cs2[4]) return false
  if (cs1[5] !== cs2[5]) return false
  if (cs1[6] !== cs2[6]) return false
  if (cs1[7] !== cs2[7]) return false
  if (cs1[8] !== cs2[8]) return false
  if (cs1[9] !== cs2[9]) return false
  if (cs1[10] !== cs2[10]) return false
  if (cs1[11] !== cs2[11]) return false
  if (cs1[12] !== cs2[12]) return false
  if (cs1[13] !== cs2[13]) return false
  if (cs1[14] !== cs2[14]) return false
  if (cs1[15] !== cs2[15]) return false

  return true
}
