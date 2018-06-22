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

import {AUTO_SIZING_TOKEN} from '../Layout3D';

const SIZE_PROPORTIONAL = 0; // A percentage of the parent
const SIZE_ABSOLUTE = 1; // A fixed size in screen pixels
const SIZING_COMPONENTS = ['x', 'y', 'z'];

const useAutoSizing = (givenValue): boolean => {
  return (
    givenValue === AUTO_SIZING_TOKEN ||
    // Legacy. Because HaikuComponent#render gets called before Migration.runMigrations,
    // the legacy value won't be correctly migrated to 'auto' by the time this gets called
    // for the very first time, so we keep it around for backwards compat. Jun 22, 2018.
    givenValue === true
  );
};

export default function computeSize (
  layoutSpec,
  sizeModeArray,
  parentSize,
  contentSize,
) {
  const outputSize = {};

  for (let i = 0; i < SIZING_COMPONENTS.length; i++) {
    const component = SIZING_COMPONENTS[i];

    const contentSizeValue = contentSize && contentSize[component];
    const parentSizeValue = parentSize[component];

    switch (sizeModeArray[component]) {
      case SIZE_PROPORTIONAL:
        const sizeProportional = layoutSpec.sizeProportional[component];
        const sizeDifferential = layoutSpec.sizeDifferential[component];
        outputSize[component] = parentSizeValue * sizeProportional + sizeDifferential;
        break;

      case SIZE_ABSOLUTE:
        const givenValue = layoutSpec.sizeAbsolute[component];

        // Implements 'true sizing': Use content size if available, otherwise fallback to parent
        if (useAutoSizing(givenValue)) {
          if (contentSizeValue) {
            outputSize[component] = contentSizeValue;
          } else {
            outputSize[component] = parentSizeValue;
          }
        } else {
          outputSize[component] = givenValue; // Assume the given value is numeric
        }

        break;
    }
  }

  return outputSize;
}
