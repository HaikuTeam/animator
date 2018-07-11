/**
 * The MIT License
 *
 * Copyright (c) 2016 adragonite
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */
import {ThreeTuple} from '../mat4-decompose';

const precision = 1e-6;

export const doublesEqual = (d1: number, d2: number, epsilon = precision): boolean => Math.abs(d1 - d2) < epsilon;

/**
 * Returns the euler angles for the given quaternion
 * The rotations for the euler angles are applied in the order: z then y then x
 * @param x {number} quaternion X
 * @param y {number} quaternion Y
 * @param z {number} quaternion Z
 * @param w {number} quaternion W
 * @returns {Object} eulerAngles: [x,y,z]
 */
export const getEulerAngles = (x: number, y: number, z: number, w: number): ThreeTuple => {
  const poleSum = x * w - y * z;

  if (doublesEqual(poleSum, 0.5)) {
    return [Math.PI / 2, 0, 0];
  }

  if (doublesEqual(poleSum, -0.5)) {
    return [3 * Math.PI / 2, 0, 0];
  }

  return [
    Math.atan2(2 * (x * w - y * z), (w * w - x * x - y * y + z * z)),
    Math.asin(2 * (x * z + y * w)),
    Math.atan2(2 * (z * w - x * y), (w * w + x * x - y * y - z * z)),
  ].map((value) => (value < -precision) ? value + Math.PI * 2 : value) as ThreeTuple;
};
