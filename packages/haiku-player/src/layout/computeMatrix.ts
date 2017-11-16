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

export default function computeMatrix(
  outputNodepad,
  layoutSpec,
  currentMatrix,
  currentsizeAbsolute,
  parentMatrix,
  parentsizeAbsolute,
) {
  const translationX = layoutSpec.translation.x;
  const translationY = layoutSpec.translation.y;
  const translationZ = layoutSpec.translation.z;
  const orientationX = layoutSpec.orientation.x;
  const orientationY = layoutSpec.orientation.y;
  const orientationZ = layoutSpec.orientation.z;
  const orientationW = layoutSpec.orientation.w;
  const scaleX = layoutSpec.scale.x;
  const scaleY = layoutSpec.scale.y;
  const scaleZ = layoutSpec.scale.z;
  const alignX = layoutSpec.align.x * parentsizeAbsolute.x;
  const alignY = layoutSpec.align.y * parentsizeAbsolute.y;
  const alignZ = layoutSpec.align.z * parentsizeAbsolute.z;
  const mountPointX = layoutSpec.mount.x * currentsizeAbsolute.x;
  const mountPointY = layoutSpec.mount.y * currentsizeAbsolute.y;
  const mountPointZ = layoutSpec.mount.z * currentsizeAbsolute.z;
  const originX = layoutSpec.origin.x * currentsizeAbsolute.x;
  const originY = layoutSpec.origin.y * currentsizeAbsolute.y;
  const originZ = layoutSpec.origin.z * currentsizeAbsolute.z;

  const wx = orientationW * orientationX;
  const wy = orientationW * orientationY;
  const wz = orientationW * orientationZ;
  const xx = orientationX * orientationX;
  const yy = orientationY * orientationY;
  const zz = orientationZ * orientationZ;
  const xy = orientationX * orientationY;
  const xz = orientationX * orientationZ;
  const yz = orientationY * orientationZ;

  const rs0 = (1 - 2 * (yy + zz)) * scaleX;
  const rs1 = 2 * (xy + wz) * scaleX;
  const rs2 = 2 * (xz - wy) * scaleX;
  const rs3 = 2 * (xy - wz) * scaleY;
  const rs4 = (1 - 2 * (xx + zz)) * scaleY;
  const rs5 = 2 * (yz + wx) * scaleY;
  const rs6 = 2 * (xz + wy) * scaleZ;
  const rs7 = 2 * (yz - wx) * scaleZ;
  const rs8 = (1 - 2 * (xx + yy)) * scaleZ;

  const tx =
    alignX +
    translationX -
    mountPointX +
    originX -
    (rs0 * originX + rs3 * originY + rs6 * originZ);
  const ty =
    alignY +
    translationY -
    mountPointY +
    originY -
    (rs1 * originX + rs4 * originY + rs7 * originZ);
  const tz =
    alignZ +
    translationZ -
    mountPointZ +
    originZ -
    (rs2 * originX + rs5 * originY + rs8 * originZ);

  outputNodepad.align = {x: alignX, y: alignY, z: alignZ};
  outputNodepad.mount = {x: mountPointX, y: mountPointY, z: mountPointZ};
  outputNodepad.origin = {x: originX, y: originY, z: originZ};
  outputNodepad.offset = {x: tx, y: ty, z: tz};

  return [
    parentMatrix[0] * rs0 + parentMatrix[4] * rs1 + parentMatrix[8] * rs2,
    parentMatrix[1] * rs0 + parentMatrix[5] * rs1 + parentMatrix[9] * rs2,
    parentMatrix[2] * rs0 + parentMatrix[6] * rs1 + parentMatrix[10] * rs2,
    0,
    parentMatrix[0] * rs3 + parentMatrix[4] * rs4 + parentMatrix[8] * rs5,
    parentMatrix[1] * rs3 + parentMatrix[5] * rs4 + parentMatrix[9] * rs5,
    parentMatrix[2] * rs3 + parentMatrix[6] * rs4 + parentMatrix[10] * rs5,
    0,
    parentMatrix[0] * rs6 + parentMatrix[4] * rs7 + parentMatrix[8] * rs8,
    parentMatrix[1] * rs6 + parentMatrix[5] * rs7 + parentMatrix[9] * rs8,
    parentMatrix[2] * rs6 + parentMatrix[6] * rs7 + parentMatrix[10] * rs8,
    0,
    parentMatrix[0] * tx + parentMatrix[4] * ty + parentMatrix[8] * tz,
    parentMatrix[1] * tx + parentMatrix[5] * ty + parentMatrix[9] * tz,
    parentMatrix[2] * tx + parentMatrix[6] * ty + parentMatrix[10] * tz,
    1,
  ];
}
