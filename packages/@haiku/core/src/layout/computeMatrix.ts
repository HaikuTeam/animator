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

import computeOrientationFlexibly from './computeOrientationFlexibly';

export default function computeMatrix(layoutSpec, currentMatrix, currentsizeAbsolute, parentsizeAbsolute) {
  const alignX = layoutSpec.align.x * parentsizeAbsolute.x;
  const alignY = layoutSpec.align.y * parentsizeAbsolute.y;
  const alignZ = layoutSpec.align.z * parentsizeAbsolute.z;
  const mountPointX = layoutSpec.mount.x * currentsizeAbsolute.x;
  const mountPointY = layoutSpec.mount.y * currentsizeAbsolute.y;
  const mountPointZ = layoutSpec.mount.z * currentsizeAbsolute.z;
  const originX = layoutSpec.origin.x * currentsizeAbsolute.x;
  const originY = layoutSpec.origin.y * currentsizeAbsolute.y;
  const originZ = layoutSpec.origin.z * currentsizeAbsolute.z;

  layoutSpec.orientation = computeOrientationFlexibly(
    layoutSpec.rotation.x,
    layoutSpec.rotation.y,
    layoutSpec.rotation.z,
  );

  const wx = layoutSpec.orientation.w * layoutSpec.orientation.x;
  const wy = layoutSpec.orientation.w * layoutSpec.orientation.y;
  const wz = layoutSpec.orientation.w * layoutSpec.orientation.z;
  const xx = layoutSpec.orientation.x * layoutSpec.orientation.x;
  const yy = layoutSpec.orientation.y * layoutSpec.orientation.y;
  const zz = layoutSpec.orientation.z * layoutSpec.orientation.z;
  const xy = layoutSpec.orientation.x * layoutSpec.orientation.y;
  const xz = layoutSpec.orientation.x * layoutSpec.orientation.z;
  const yz = layoutSpec.orientation.y * layoutSpec.orientation.z;

  let rs0 = (1 - 2 * (yy + zz));
  let rs1 = 2 * (xy + wz);
  let rs2 = 2 * (xz - wy);
  let rs3 = 2 * (xy - wz);
  let rs4 = (1 - 2 * (xx + zz));
  let rs5 = 2 * (yz + wx);
  let rs6 = 2 * (xz + wy);
  let rs7 = 2 * (yz - wx);
  let rs8 = (1 - 2 * (xx + yy));

  if (layoutSpec.shear.xy || layoutSpec.shear.xz || layoutSpec.shear.yz) {
    const shearXzProxy = layoutSpec.shear.xy * layoutSpec.shear.yz + layoutSpec.shear.xz;
    rs6 += layoutSpec.shear.yz * rs3 + shearXzProxy * rs0;
    rs7 += layoutSpec.shear.yz * rs4 + shearXzProxy * rs1;
    rs8 += layoutSpec.shear.yz * rs5 + shearXzProxy * rs2;
    rs3 += layoutSpec.shear.xy * rs0;
    rs4 += layoutSpec.shear.xy * rs1;
    rs5 += layoutSpec.shear.xy * rs2;
  }

  rs0 *= layoutSpec.scale.x;
  rs1 *= layoutSpec.scale.x;
  rs2 *= layoutSpec.scale.x;
  rs3 *= layoutSpec.scale.y;
  rs4 *= layoutSpec.scale.y;
  rs5 *= layoutSpec.scale.y;
  rs6 *= layoutSpec.scale.z;
  rs7 *= layoutSpec.scale.z;
  rs8 *= layoutSpec.scale.z;

  const tx =
    alignX +
    layoutSpec.translation.x -
    mountPointX -
    (rs0 * originX + rs3 * originY + rs6 * originZ);
  const ty =
    alignY +
    layoutSpec.translation.y -
    mountPointY -
    (rs1 * originX + rs4 * originY + rs7 * originZ);
  const tz =
    alignZ +
    layoutSpec.translation.z -
    mountPointZ -
    (rs2 * originX + rs5 * originY + rs8 * originZ);

  return [rs0, rs1, rs2, 0, rs3, rs4, rs5, 0, rs6, rs7, rs8, 0, tx, ty, tz, 1];
}
