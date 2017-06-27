// The code in computeMatrix.js is derived in part from code in https://github.com/Famous/engine/blob/master/core/Transform.js which is MIT licensed:
// The MIT License (MIT)
// Copyright (c) 2015 Famous Industries Inc.
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

function computeMatrix (
  outputMatrix,
  outputNodepad,
  layoutSpec,
  currentMatrix,
  currentsizeAbsolute,
  parentMatrix,
  parentsizeAbsolute
) {
  var translationX = layoutSpec.translation.x
  var translationY = layoutSpec.translation.y
  var translationZ = layoutSpec.translation.z
  var rotationX = layoutSpec.rotation.x
  var rotationY = layoutSpec.rotation.y
  var rotationZ = layoutSpec.rotation.z
  var rotationW = layoutSpec.rotation.w
  var scaleX = layoutSpec.scale.x
  var scaleY = layoutSpec.scale.y
  var scaleZ = layoutSpec.scale.z
  var alignX = layoutSpec.align.x * parentsizeAbsolute.x
  var alignY = layoutSpec.align.y * parentsizeAbsolute.y
  var alignZ = layoutSpec.align.z * parentsizeAbsolute.z
  var mountPointX = layoutSpec.mount.x * currentsizeAbsolute.x
  var mountPointY = layoutSpec.mount.y * currentsizeAbsolute.y
  var mountPointZ = layoutSpec.mount.z * currentsizeAbsolute.z
  var originX = layoutSpec.origin.x * currentsizeAbsolute.x
  var originY = layoutSpec.origin.y * currentsizeAbsolute.y
  var originZ = layoutSpec.origin.z * currentsizeAbsolute.z

  var wx = rotationW * rotationX
  var wy = rotationW * rotationY
  var wz = rotationW * rotationZ
  var xx = rotationX * rotationX
  var yy = rotationY * rotationY
  var zz = rotationZ * rotationZ
  var xy = rotationX * rotationY
  var xz = rotationX * rotationZ
  var yz = rotationY * rotationZ

  var rs0 = (1 - 2 * (yy + zz)) * scaleX
  var rs1 = 2 * (xy + wz) * scaleX
  var rs2 = 2 * (xz - wy) * scaleX
  var rs3 = 2 * (xy - wz) * scaleY
  var rs4 = (1 - 2 * (xx + zz)) * scaleY
  var rs5 = 2 * (yz + wx) * scaleY
  var rs6 = 2 * (xz + wy) * scaleZ
  var rs7 = 2 * (yz - wx) * scaleZ
  var rs8 = (1 - 2 * (xx + yy)) * scaleZ

  var tx = alignX +
    translationX -
    mountPointX +
    originX -
    (rs0 * originX + rs3 * originY + rs6 * originZ)
  var ty = alignY +
    translationY -
    mountPointY +
    originY -
    (rs1 * originX + rs4 * originY + rs7 * originZ)
  var tz = alignZ +
    translationZ -
    mountPointZ +
    originZ -
    (rs2 * originX + rs5 * originY + rs8 * originZ)

  outputNodepad.align = { x: alignX, y: alignY, z: alignZ }
  outputNodepad.mount = { x: mountPointX, y: mountPointY, z: mountPointZ }
  outputNodepad.origin = { x: originX, y: originY, z: originZ }
  outputNodepad.offset = { x: tx, y: ty, z: tz }

  outputMatrix[0] = parentMatrix[0] * rs0 +
    parentMatrix[4] * rs1 +
    parentMatrix[8] * rs2
  outputMatrix[1] = parentMatrix[1] * rs0 +
    parentMatrix[5] * rs1 +
    parentMatrix[9] * rs2
  outputMatrix[2] = parentMatrix[2] * rs0 +
    parentMatrix[6] * rs1 +
    parentMatrix[10] * rs2
  outputMatrix[3] = 0
  outputMatrix[4] = parentMatrix[0] * rs3 +
    parentMatrix[4] * rs4 +
    parentMatrix[8] * rs5
  outputMatrix[5] = parentMatrix[1] * rs3 +
    parentMatrix[5] * rs4 +
    parentMatrix[9] * rs5
  outputMatrix[6] = parentMatrix[2] * rs3 +
    parentMatrix[6] * rs4 +
    parentMatrix[10] * rs5
  outputMatrix[7] = 0
  outputMatrix[8] = parentMatrix[0] * rs6 +
    parentMatrix[4] * rs7 +
    parentMatrix[8] * rs8
  outputMatrix[9] = parentMatrix[1] * rs6 +
    parentMatrix[5] * rs7 +
    parentMatrix[9] * rs8
  outputMatrix[10] = parentMatrix[2] * rs6 +
    parentMatrix[6] * rs7 +
    parentMatrix[10] * rs8
  outputMatrix[11] = 0
  outputMatrix[12] = parentMatrix[0] * tx +
    parentMatrix[4] * ty +
    parentMatrix[8] * tz
  outputMatrix[13] = parentMatrix[1] * tx +
    parentMatrix[5] * ty +
    parentMatrix[9] * tz
  outputMatrix[14] = parentMatrix[2] * tx +
    parentMatrix[6] * ty +
    parentMatrix[10] * tz
  outputMatrix[15] = 1

  return outputMatrix
}

module.exports = computeMatrix
