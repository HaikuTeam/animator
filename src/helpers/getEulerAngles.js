// The code in getEulerAngles.js is partially derived from code in https://github.com/adragonite/math3d/blob/master/src/Quaternion.js, which is MIT licensed:
// The MIT License (MIT)
// Copyright (c) 2016 adragonite
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function doublesEqual (d1, d2) {
  var preciseness = 1e-13
  return Math.abs(d1 - d2) < preciseness
}

function normalizeRad (rad) {
  var angle = rad * (180.0 / Math.PI)
  while (angle > 360) {
    angle -= 360
  }
  while (angle < 0) {
    angle += 360
  }
  return angle
}

/**
 * Returns the euler angles for the given quaternion
 * The rotations for the euler angles are applied in the order: z then x then y
 * @param {Quternion} quaternion
 * @returns {Object} eulerAngles: [x,y,z]
 */
function _getEulerAngles (x, y, z, w) {
  var poleSum = x * w - y * z

  if (doublesEqual(poleSum, 0.5)) return [90, 0, 0]
  else if (doublesEqual(poleSum, -0.5)) return [-90, 0, 0]

  var _x = Math.asin(2 * x * w - 2 * y * z)
  var _y = Math.atan2(2 * x * z + 2 * y * w, 1 - 2 * (y * y) - 2 * (x * x))
  var _z = Math.PI -
    Math.atan2(2 * x * y + 2 * z * w, 1 - 2 * (y * y) - 2 * (w * w))

  return [normalizeRad(_x), normalizeRad(_y), normalizeRad(_z)]
}

module.exports = _getEulerAngles
