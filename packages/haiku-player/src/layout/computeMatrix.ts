/**
 * This file contains modified code from https://github.com/famous/engine
 *
 * The original code was released under the MIT license.
 *
 * MIT License (MIT)
 *
 * Copyright (c) 2015 Famous Industries Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

function computeMatrix(
  outputMatrix,
  outputNodepad,
  layoutSpec,
  currentMatrix,
  currentsizeAbsolute,
  parentMatrix,
  parentsizeAbsolute,
) {
  let translationX = layoutSpec.translation.x
  let translationY = layoutSpec.translation.y
  let translationZ = layoutSpec.translation.z
  let rotationX = layoutSpec.rotation.x
  let rotationY = layoutSpec.rotation.y
  let rotationZ = layoutSpec.rotation.z
  let rotationW = layoutSpec.rotation.w
  let scaleX = layoutSpec.scale.x
  let scaleY = layoutSpec.scale.y
  let scaleZ = layoutSpec.scale.z
  let alignX = layoutSpec.align.x * parentsizeAbsolute.x
  let alignY = layoutSpec.align.y * parentsizeAbsolute.y
  let alignZ = layoutSpec.align.z * parentsizeAbsolute.z
  let mountPointX = layoutSpec.mount.x * currentsizeAbsolute.x
  let mountPointY = layoutSpec.mount.y * currentsizeAbsolute.y
  let mountPointZ = layoutSpec.mount.z * currentsizeAbsolute.z
  let originX = layoutSpec.origin.x * currentsizeAbsolute.x
  let originY = layoutSpec.origin.y * currentsizeAbsolute.y
  let originZ = layoutSpec.origin.z * currentsizeAbsolute.z

  let wx = rotationW * rotationX
  let wy = rotationW * rotationY
  let wz = rotationW * rotationZ
  let xx = rotationX * rotationX
  let yy = rotationY * rotationY
  let zz = rotationZ * rotationZ
  let xy = rotationX * rotationY
  let xz = rotationX * rotationZ
  let yz = rotationY * rotationZ

  let rs0 = (1 - 2 * (yy + zz)) * scaleX
  let rs1 = 2 * (xy + wz) * scaleX
  let rs2 = 2 * (xz - wy) * scaleX
  let rs3 = 2 * (xy - wz) * scaleY
  let rs4 = (1 - 2 * (xx + zz)) * scaleY
  let rs5 = 2 * (yz + wx) * scaleY
  let rs6 = 2 * (xz + wy) * scaleZ
  let rs7 = 2 * (yz - wx) * scaleZ
  let rs8 = (1 - 2 * (xx + yy)) * scaleZ

  let tx =
    alignX +
    translationX -
    mountPointX +
    originX -
    (rs0 * originX + rs3 * originY + rs6 * originZ)
  let ty =
    alignY +
    translationY -
    mountPointY +
    originY -
    (rs1 * originX + rs4 * originY + rs7 * originZ)
  let tz =
    alignZ +
    translationZ -
    mountPointZ +
    originZ -
    (rs2 * originX + rs5 * originY + rs8 * originZ)

  outputNodepad.align = { x: alignX, y: alignY, z: alignZ }
  outputNodepad.mount = { x: mountPointX, y: mountPointY, z: mountPointZ }
  outputNodepad.origin = { x: originX, y: originY, z: originZ }
  outputNodepad.offset = { x: tx, y: ty, z: tz }

  outputMatrix[0] =
    parentMatrix[0] * rs0 + parentMatrix[4] * rs1 + parentMatrix[8] * rs2
  outputMatrix[1] =
    parentMatrix[1] * rs0 + parentMatrix[5] * rs1 + parentMatrix[9] * rs2
  outputMatrix[2] =
    parentMatrix[2] * rs0 + parentMatrix[6] * rs1 + parentMatrix[10] * rs2
  outputMatrix[3] = 0
  outputMatrix[4] =
    parentMatrix[0] * rs3 + parentMatrix[4] * rs4 + parentMatrix[8] * rs5
  outputMatrix[5] =
    parentMatrix[1] * rs3 + parentMatrix[5] * rs4 + parentMatrix[9] * rs5
  outputMatrix[6] =
    parentMatrix[2] * rs3 + parentMatrix[6] * rs4 + parentMatrix[10] * rs5
  outputMatrix[7] = 0
  outputMatrix[8] =
    parentMatrix[0] * rs6 + parentMatrix[4] * rs7 + parentMatrix[8] * rs8
  outputMatrix[9] =
    parentMatrix[1] * rs6 + parentMatrix[5] * rs7 + parentMatrix[9] * rs8
  outputMatrix[10] =
    parentMatrix[2] * rs6 + parentMatrix[6] * rs7 + parentMatrix[10] * rs8
  outputMatrix[11] = 0
  outputMatrix[12] =
    parentMatrix[0] * tx + parentMatrix[4] * ty + parentMatrix[8] * tz
  outputMatrix[13] =
    parentMatrix[1] * tx + parentMatrix[5] * ty + parentMatrix[9] * tz
  outputMatrix[14] =
    parentMatrix[2] * tx + parentMatrix[6] * ty + parentMatrix[10] * tz
  outputMatrix[15] = 1

  return outputMatrix
}

module.exports = computeMatrix
