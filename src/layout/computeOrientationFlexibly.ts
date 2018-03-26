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

export default function computeOrientationFlexibly(x, y, z) {
  if (x === 0 && y === 0 && z === 0) {
    return {x, y, z, w: 0};
  }

  const hx = x * 0.5;
  const hy = y * 0.5;
  const hz = z * 0.5;

  const sx = Math.sin(hx);
  const sy = Math.sin(hy);
  const sz = Math.sin(hz);
  const cx = Math.cos(hx);
  const cy = Math.cos(hy);
  const cz = Math.cos(hz);

  const sysz = sy * sz;
  const cysz = cy * sz;
  const sycz = sy * cz;
  const cycz = cy * cz;

  return {
    x: sx * cycz + cx * sysz,
    y: cx * sycz - sx * cysz,
    z: cx * cysz + sx * sycz,
    w: cx * cycz - sx * sysz,
  };
}
