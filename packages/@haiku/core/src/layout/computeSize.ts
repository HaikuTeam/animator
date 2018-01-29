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

const SIZE_PROPORTIONAL = 0; // A percentage of the parent
const SIZE_ABSOLUTE = 1; // A fixed size in screen pixels
const SIZING_COMPONENTS = ['x', 'y', 'z'];

export default function computeSize(layoutSpec, sizeModeArray, parentsizeAbsolute) {
  const outputSize = {};
  for (let i = 0; i < SIZING_COMPONENTS.length; i++) {
    const component = SIZING_COMPONENTS[i];
    switch (sizeModeArray[component]) {
      case SIZE_PROPORTIONAL:
        const sizeProportional = layoutSpec.sizeProportional[component];
        const sizeDifferential = layoutSpec.sizeDifferential[component];
        outputSize[component] =
          parentsizeAbsolute[component] * sizeProportional + sizeDifferential;
        break;
      case SIZE_ABSOLUTE:
        outputSize[component] = layoutSpec.sizeAbsolute[component];
        break;
    }
  }
  return outputSize;
}
