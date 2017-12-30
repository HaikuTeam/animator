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
import {isMatrixableTransformArray} from '../helpers/isMatrixableTransformArray';
import {transformValueIsEssentiallyInt} from '../helpers/transformValueIsEssentiallyInt';
import Layout3D from '../Layout3D';

const TRANSFORM_SUFFIX = ')';
const TRANSFORM_ZERO = '0';
const TRANSFORM_COMMA = ',';
const TRANSFORM_ZILCH = TRANSFORM_ZERO + TRANSFORM_COMMA;

export default function formatTransform(transform, format, devicePixelRatio) {
  transform[12] =
    Math.round(transform[12] * devicePixelRatio) / devicePixelRatio;
  transform[13] =
    Math.round(transform[13] * devicePixelRatio) / devicePixelRatio;

  let prefix;
  let last;
  if (format === Layout3D.FORMATS.TWO) {
    // Example: matrix(1,0,0,0,0,1)
    // 2d matrix is: matrix(scaleX(),skewY(),skewX(),scaleY(),translateX(),translateY())
    // Modify via: matrix(a,b,c,d,tx,ty) <= matrix3d(a,b,0,0,c,d,0,0,0,0,1,0,tx,ty,0,1)

    // Note how we set the transform far to two here!
    // tslint:disable-next-line:no-parameter-reassignment
    transform = [
      transform[0],
      transform[1],
      transform[4],
      transform[5],
      transform[12],
      transform[13],
    ];

    prefix = 'matrix(';
    last = 5;
  } else {
    // Example: matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,716,243,0,1)
    prefix = 'matrix3d(';
    last = 15;
  }

  for (let i = 0; i < last; i += 1) {
    prefix += transformValueIsEssentiallyInt(transform[i], 0) ? TRANSFORM_ZILCH : transform[i] + TRANSFORM_COMMA;
  }

  prefix += transform[last] + TRANSFORM_SUFFIX;

  return prefix;
}
