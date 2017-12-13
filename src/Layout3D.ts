/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import computeMatrix from './layout/computeMatrix';
import computeOrientationFlexibly from './layout/computeOrientationFlexibly';
import computeSize from './layout/computeSize';

const ELEMENTS_2D = {
  circle: true,
  ellipse: true,
  foreignObject: true,
  g: true,
  image: true,
  line: true,
  mesh: true,
  path: true,
  polygon: true,
  polyline: true,
  rect: true,
  // svg: true, // Since we host <svg> only underneath <div> it should be fine to set this?
  switch: true,
  symbol: true,
  text: true,
  textPath: true,
  tspan: true,
  unknown: true,
  use: true,
};

// Coordinate (0, 0, 0) is the top left of the screen

const SIZE_PROPORTIONAL = 0; // A percentage of the parent
const SIZE_ABSOLUTE = 1; // A fixed size in screen pixels
const DEFAULT_DEPTH = 0;
const IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

// Used for rendering downstream
const FORMATS = {
  THREE: 3,
  TWO: 2,
};

function initializeNodeAttributes(element) {
  if (!element.attributes) {
    element.attributes = {};
  }
  if (!element.attributes.style) {
    element.attributes.style = {};
  }
  if (!element.layout) {
    element.layout = createLayoutSpec(null, null, null);
    element.layout.matrix = createMatrix();
    element.layout.format = ELEMENTS_2D[element.elementName]
      ? FORMATS.TWO
      : FORMATS.THREE;
  }
  return element;
}

function initializeTreeAttributes(tree, container) {
  if (!tree || typeof tree === 'string') {
    return;
  }
  initializeNodeAttributes(tree);
  tree.__parent = container;
  if (!tree.children || tree.children.length < 1) {
    return;
  }
  for (let i = 0; i < tree.children.length; i++) {
    initializeTreeAttributes(tree.children[i], tree);
  }
}

// The layout specification naming in createLayoutSpec is derived in part from:
// https://github.com/Famous/engine/blob/master/core/Transform.js which is MIT licensed.
// The MIT License (MIT)
// Copyright (c) 2015 Famous Industries Inc.
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
// documentation files (the "Software"), to deal in the Software without restriction, including without limitation
// the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
// to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of
// the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT
// NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO
// EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.
function createLayoutSpec(ax, ay, az) {
  return {
    shown: true,
    opacity: 1.0,
    mount: {x: ax || 0, y: ay || 0, z: az || 0}, // anchor in self
    align: {x: ax || 0, y: ay || 0, z: az || 0}, // anchor in context
    origin: {x: ax || 0, y: ay || 0, z: az || 0}, // transform origin
    translation: {x: 0, y: 0, z: 0},
    rotation: {x: 0, y: 0, z: 0, w: 0},
    orientation: {x: 0, y: 0, z: 0, w: 0},
    scale: {x: 1, y: 1, z: 1},
    sizeMode: {
      x: SIZE_PROPORTIONAL,
      y: SIZE_PROPORTIONAL,
      z: SIZE_PROPORTIONAL,
    },
    sizeProportional: {x: 1, y: 1, z: 1},
    sizeDifferential: {x: 0, y: 0, z: 0},
    sizeAbsolute: {x: 0, y: 0, z: 0},
  };
}

function createMatrix() {
  return copyMatrix(IDENTITY);
}

function copyMatrix(m: number[]) {
  return [...m];
}

function multiplyMatrices(a: number[], b: number[]): number[] {
  return [
    a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12],
    a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13],
    a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14],
    a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15],
    a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12],
    a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13],
    a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14],
    a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15],
    a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12],
    a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13],
    a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14],
    a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15],
    a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12],
    a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13],
    a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14],
    a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15],
  ];
}

function multiplyArrayOfMatrices(arrayOfMatrices: number[][]): number[] {
  let product = createMatrix();
  for (let i = 0; i < arrayOfMatrices.length; i++) {
    product = multiplyMatrices(product, arrayOfMatrices[i]);
  }
  return product;
}

function computeLayout(layoutSpec, currentMatrix, parentsizeAbsoluteIn) {
  const parentsizeAbsolute = parentsizeAbsoluteIn || {x: 0, y: 0, z: 0};

  if (parentsizeAbsolute.z === undefined || parentsizeAbsolute.z === null) {
    parentsizeAbsolute.z = DEFAULT_DEPTH;
  }

  const size = computeSize(layoutSpec, layoutSpec.sizeMode, parentsizeAbsolute);
  return {
    ...layoutSpec,
    size,
    matrix: computeMatrix(layoutSpec, currentMatrix, size, parentsizeAbsolute),
  };
}

export default {
  multiplyArrayOfMatrices,
  computeLayout,
  createLayoutSpec,
  computeOrientationFlexibly,
  createMatrix,
  multiplyMatrices,
  copyMatrix,
  initializeTreeAttributes,
  FORMATS,
  SIZE_ABSOLUTE,
  SIZE_PROPORTIONAL,
  ATTRIBUTES: createLayoutSpec(null, null, null),
};
