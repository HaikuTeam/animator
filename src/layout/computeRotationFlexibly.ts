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

function computeRotationFlexibly(x, y, z, w, quat) {
  // If w-component was given, we are dealing with someone who is quaternion-savvy,
  // and who we assume wants to compute a rotation exactly, so we'll just return the vector
  // if (w != null) {
  //   return { x: x, y: y, z: z, w: w }
  // }

  // Otherwise, the expectation is that somebody is going to pass the previous
  // quaternion so we can adjust it relative to where it had been before,
  // that is, by passing in Euler angles. Therefore, if the given quaternion
  // isn't an array, we can't continue.
  if (
    !quat ||
    (quat.x == null || quat.y == null || quat.z == null || quat.w == null)
  ) {
    throw new Error("No w-component nor quaternion provided!")
  }

  // If we got here, we are going to return a new quaternion to describe the
  // rotation as an adjustment based around the values passed in.
  // Before we move on to the actual calculations, we're going to handle the
  // case that any of the other values was omitted, which we will interpret
  // to mean we want to use the value given by the passed quaternion
  if (x == null || y == null || z == null) {
    let sp = -2 * (quat.y * quat.z - quat.w * quat.x)

    if (Math.abs(sp) > 0.99999) {
      y = y == null ? Math.PI * 0.5 * sp : y
      x = x == null
        ? Math.atan2(
            -quat.x * quat.z + quat.w * quat.y,
            0.5 - quat.y * quat.y - quat.z * quat.z,
          )
        : x
      z = z == null ? 0 : z
    } else {
      y = y == null ? Math.asin(sp) : y
      x = x == null
        ? Math.atan2(
            quat.x * quat.z + quat.w * quat.y,
            0.5 - quat.x * quat.x - quat.y * quat.y,
          )
        : x
      z = z == null
        ? Math.atan2(
            quat.x * quat.y + quat.w * quat.z,
            0.5 - quat.x * quat.x - quat.z * quat.z,
          )
        : z
    }
  }

  let hx = x * 0.5
  let hy = y * 0.5
  let hz = z * 0.5

  let sx = Math.sin(hx)
  let sy = Math.sin(hy)
  let sz = Math.sin(hz)
  let cx = Math.cos(hx)
  let cy = Math.cos(hy)
  let cz = Math.cos(hz)

  let sysz = sy * sz
  let cysz = cy * sz
  let sycz = sy * cz
  let cycz = cy * cz

  let qx = sx * cycz + cx * sysz
  let qy = cx * sycz - sx * cysz
  let qz = cx * cysz + sx * sycz
  let qw = cx * cycz - sx * sysz

  return { x: qx, y: qy, z: qz, w: qw }
}

module.exports = computeRotationFlexibly
