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

var TRANSFORM_SUFFIX = ')'
var TRANSFORM_ZERO = '0'
var TRANSFORM_COMMA = ','
var TRANSFORM_ZILCH = TRANSFORM_ZERO + TRANSFORM_COMMA
var TWO = 2
var THREE = 3

function formatTransform (transform, format, devicePixelRatio) {
  transform[12] =
    Math.round(transform[12] * devicePixelRatio) / devicePixelRatio
  transform[13] =
    Math.round(transform[13] * devicePixelRatio) / devicePixelRatio

  var prefix
  var last
  if (format === TWO) {
    // Example: matrix(1,0,0,0,0,1)
    // 2d matrix is: matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY())
    // Modify via: matrix(a,b,c,d,tx,ty) <= matrix3d(a,b,0,0,c,d,0,0,0,0,1,0,tx,ty,0,1)
    var two = [
      transform[0],
      transform[1],
      transform[4],
      transform[5],
      transform[12],
      transform[13]
    ]

    // Note how we set the transform far to two here!
    transform = two

    prefix = 'matrix('
    last = 5
  } else if (format === THREE) {
    // Example: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,716,243,0,1)
    prefix = 'matrix3d('
    last = 15
  }

  prefix += (transform[0] < 0.000001 && transform[0] > -0.000001) ? TRANSFORM_ZILCH : transform[0] + TRANSFORM_COMMA
  prefix += (transform[1] < 0.000001 && transform[1] > -0.000001) ? TRANSFORM_ZILCH : transform[1] + TRANSFORM_COMMA
  prefix += (transform[2] < 0.000001 && transform[2] > -0.000001) ? TRANSFORM_ZILCH : transform[2] + TRANSFORM_COMMA
  prefix += (transform[3] < 0.000001 && transform[3] > -0.000001) ? TRANSFORM_ZILCH : transform[3] + TRANSFORM_COMMA
  prefix += (transform[4] < 0.000001 && transform[4] > -0.000001) ? TRANSFORM_ZILCH : transform[4] + TRANSFORM_COMMA
  if (last > 5) {
    prefix += (transform[5] < 0.000001 && transform[5] > -0.000001) ? TRANSFORM_ZILCH : transform[5] + TRANSFORM_COMMA
    prefix += (transform[6] < 0.000001 && transform[6] > -0.000001) ? TRANSFORM_ZILCH : transform[6] + TRANSFORM_COMMA
    prefix += (transform[7] < 0.000001 && transform[7] > -0.000001) ? TRANSFORM_ZILCH : transform[7] + TRANSFORM_COMMA
    prefix += (transform[8] < 0.000001 && transform[8] > -0.000001) ? TRANSFORM_ZILCH : transform[8] + TRANSFORM_COMMA
    prefix += (transform[9] < 0.000001 && transform[9] > -0.000001) ? TRANSFORM_ZILCH : transform[9] + TRANSFORM_COMMA
    prefix += (transform[10] < 0.000001 && transform[10] > -0.000001) ? TRANSFORM_ZILCH : transform[10] + TRANSFORM_COMMA
    prefix += (transform[11] < 0.000001 && transform[11] > -0.000001) ? TRANSFORM_ZILCH : transform[11] + TRANSFORM_COMMA
    prefix += (transform[12] < 0.000001 && transform[12] > -0.000001) ? TRANSFORM_ZILCH : transform[12] + TRANSFORM_COMMA
    prefix += (transform[13] < 0.000001 && transform[13] > -0.000001) ? TRANSFORM_ZILCH : transform[13] + TRANSFORM_COMMA
    prefix += (transform[14] < 0.000001 && transform[14] > -0.000001) ? TRANSFORM_ZILCH : transform[14] + TRANSFORM_COMMA
  }

  prefix += transform[last] + TRANSFORM_SUFFIX

  return prefix
}

module.exports = formatTransform
