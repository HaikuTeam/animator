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

export default function computeMatrix(layoutSpec, currentMatrix, currentsizeAbsolute, parentsizeAbsolute) {
  const alignY = layoutSpec.align.y * parentsizeAbsolute.y;
  const alignX = layoutSpec.align.x * parentsizeAbsolute.x;
  const alignZ = layoutSpec.align.z * parentsizeAbsolute.z;
  const mountPointX = layoutSpec.mount.x * currentsizeAbsolute.x;
  const mountPointY = layoutSpec.mount.y * currentsizeAbsolute.y;
  const mountPointZ = layoutSpec.mount.z * currentsizeAbsolute.z;
  const originX = layoutSpec.origin.x * currentsizeAbsolute.x;
  const originY = layoutSpec.origin.y * currentsizeAbsolute.y;
  const originZ = layoutSpec.origin.z * currentsizeAbsolute.z;

  const wx = layoutSpec.orientation.w * layoutSpec.orientation.x;
  const wy = layoutSpec.orientation.w * layoutSpec.orientation.y;
  const wz = layoutSpec.orientation.w * layoutSpec.orientation.z;
  const xx = layoutSpec.orientation.x * layoutSpec.orientation.x;
  const yy = layoutSpec.orientation.y * layoutSpec.orientation.y;
  const zz = layoutSpec.orientation.z * layoutSpec.orientation.z;
  const xy = layoutSpec.orientation.x * layoutSpec.orientation.y;
  const xz = layoutSpec.orientation.x * layoutSpec.orientation.z;
  const yz = layoutSpec.orientation.y * layoutSpec.orientation.z;

  const rs0 = (1 - 2 * (yy + zz)) * layoutSpec.scale.x;
  const rs1 = 2 * (xy + wz) * layoutSpec.scale.x;
  const rs2 = 2 * (xz - wy) * layoutSpec.scale.x;
  const rs3 = 2 * (xy - wz) * layoutSpec.scale.y;
  const rs4 = (1 - 2 * (xx + zz)) * layoutSpec.scale.y;
  const rs5 = 2 * (yz + wx) * layoutSpec.scale.y;
  const rs6 = 2 * (xz + wy) * layoutSpec.scale.z;
  const rs7 = 2 * (yz - wx) * layoutSpec.scale.z;
  const rs8 = (1 - 2 * (xx + yy)) * layoutSpec.scale.z;

  const tx =
    alignX +
    layoutSpec.translation.x -
    mountPointX +
    originX -
    (rs0 * originX + rs3 * originY + rs6 * originZ);
  const ty =
    alignY +
    layoutSpec.translation.y -
    mountPointY +
    originY -
    (rs1 * originX + rs4 * originY + rs7 * originZ);
  const tz =
    alignZ +
    layoutSpec.translation.z -
    mountPointZ +
    originZ -
    (rs2 * originX + rs5 * originY + rs8 * originZ);

  return [rs0, rs1, rs2, 0, rs3, rs4, rs5, 0, rs6, rs7, rs8, 0, tx, ty, tz, 1];
}
