/**
 * The MIT License
 * 
 * Copyright (c) justanimate
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

import {abs} from './math';
import {epsilon} from './constants';
import {Curve} from '../types';

const bezier = (n1: number, n2: number, t: number) =>
  3 * n1 * (1 - t) * (1 - t) * t + 3 * n2 * (1 - t) * t * t + t * t * t;

export const cubicBezier = (p0: number, p1: number, p2: number, p3: number): Curve => {
  if (p0 < 0 || p0 > 1 || p2 < 0 || p2 > 1) {
    return (x: number) => x;
  }

  return (x: number): number => {
    if (x === 0 || x === 1) {
      return x;
    }

    let start = 0;
    let end = 1;
    let limit = 19;

    do {
      const mid = (start + end) * .5;
      const xEst = bezier(p0, p2, mid);

      if (abs(x - xEst) < epsilon) {
        return bezier(p1, p3, mid);
      }
      if (xEst < x) {
        start = mid;
      } else {
        end = mid;
      }
    } while (--limit);

    // limit is reached
    return x;
  };
};
