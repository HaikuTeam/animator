/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import computeMatrix from './layout/computeMatrix';
import computeSize from './layout/computeSize';
import {LayoutSpec} from './api/Layout';

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

const DIV = 'div';
const SVG = 'svg';
const TYPE_STRING = 'string';
const virtualElementIsLayoutContainer = (virtualElement) => {
  // A virtual element is a layout container if the element is a component…
  return typeof virtualElement.elementName !== TYPE_STRING ||
  // …or if it is a layout container defining its own coordinate system.
  virtualElement.elementName === SVG ||
  virtualElement.elementName === DIV;
};

const initializeNodeAttributes = (element, isRootNode: boolean) => {
  if (!element.attributes) {
    element.attributes = {};
  }
  if (!element.attributes.style) {
    element.attributes.style = {};
  }
  if (!element.layout) {
    element.layout = createLayoutSpec(!isRootNode && virtualElementIsLayoutContainer(element));
    element.layout.matrix = createMatrix();
    element.layout.format = ELEMENTS_2D[element.elementName]
      ? FORMATS.TWO
      : FORMATS.THREE;
  }
  return element;
};

const initializeTreeAttributes = (tree, isRootNode: boolean) => {
  if (!tree || typeof tree === 'string') {
    return;
  }

  initializeNodeAttributes(tree, isRootNode);

  if (!tree.children || tree.children.length < 1) {
    return;
  }

  for (let i = 0; i < tree.children.length; i++) {
    initializeTreeAttributes(tree.children[i], false);
  }
};

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
const createLayoutSpec = (createCoordinateSystem?: boolean): LayoutSpec => ({
  shown: true,
  opacity: 1.0,
  mount: {x: 0, y: 0, z: 0}, // anchor in self
  align: {x: 0, y: 0, z: 0}, // anchor in context
  origin: createCoordinateSystem ? {x: 0.5, y: 0.5, z: 0.5} : {x: 0, y: 0, z: 0}, // transform origin
  translation: {x: 0, y: 0, z: 0},
  rotation: {x: 0, y: 0, z: 0},
  scale: {x: 1, y: 1, z: 1},
  shear: {xy: 0, xz: 0, yz: 0},
  sizeMode: {
    x: SIZE_PROPORTIONAL,
    y: SIZE_PROPORTIONAL,
    z: SIZE_PROPORTIONAL,
  },
  sizeProportional: {x: 1, y: 1, z: 1},
  sizeDifferential: {x: 0, y: 0, z: 0},
  sizeAbsolute: {x: 0, y: 0, z: 0},
});

const createMatrix = () => copyMatrix(IDENTITY);

const copyMatrix = (m: number[]) => [...m];

const multiplyMatrices = (a: number[], b: number[]): number[] => [
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

const multiplyArrayOfMatrices = (arrayOfMatrices: number[][]): number[] => {
  let product = createMatrix();
  for (let i = 0; i < arrayOfMatrices.length; i++) {
    product = multiplyMatrices(product, arrayOfMatrices[i]);
  }
  return product;
};

const computeSizeOfNodeContent = (node) => {
  // We can't compute a content size for missing or text nodes
  if (!node || typeof node !== 'object') {
    return null;
  }

  // For subcomponents, we should be able to read the size property directly
  if (typeof node.elementName === 'object') {
    const subroot = node.children && node.children[0];

    if (subroot && typeof subroot === 'object') {
      return {
        x: subroot.layout.sizeAbsolute.x,
        y: subroot.layout.sizeAbsolute.y,
        z: subroot.layout.sizeAbsolute.z,
      };
    }

    // We got an invalid format; nothing to compute
    return null;
  }

  // TODO: Read the union of inner primitives' bounding boxes
  return null;
};

const computeLayout = (layoutSpec, currentMatrix, parentsizeAbsoluteIn, contentSizeAbsolute) => {
  // Clean out the existing computed layout from the layout spec, if it exists.
  delete layoutSpec.computed;

  const parentsizeAbsolute = parentsizeAbsoluteIn || {x: 0, y: 0, z: 0};

  if (parentsizeAbsolute.z === undefined || parentsizeAbsolute.z === null) {
    parentsizeAbsolute.z = DEFAULT_DEPTH;
  }

  const size = computeSize(layoutSpec, layoutSpec.sizeMode, parentsizeAbsolute, contentSizeAbsolute);

  return {
    ...layoutSpec,
    size,
    matrix: computeMatrix(layoutSpec, currentMatrix, size, parentsizeAbsolute),
  };
};

const computeOrthonormalBasisMatrix = (rotation, shear) => {
  const orthonormalBasisLayout = {
    ...createLayoutSpec(),
    rotation,
    shear,
  };
  const ignoredSize = {x: 0, y: 0, z: 0};
  return computeMatrix(orthonormalBasisLayout, createMatrix(), ignoredSize, ignoredSize);
};

const computeScaledBasisMatrix = (rotation, scale, shear) => {
  const scaledBasisLayout = {
    ...createLayoutSpec(),
    rotation,
    scale,
    shear,
  };
  const ignoredSize = {x: 0, y: 0, z: 0};
  return computeMatrix(scaledBasisLayout, createMatrix(), ignoredSize, ignoredSize);
};

export default {
  multiplyArrayOfMatrices,
  computeLayout,
  computeSizeOfNodeContent,
  computeOrthonormalBasisMatrix,
  computeScaledBasisMatrix,
  createLayoutSpec,
  createMatrix,
  copyMatrix,
  initializeTreeAttributes,
  virtualElementIsLayoutContainer,
  FORMATS,
  SIZE_ABSOLUTE,
  SIZE_PROPORTIONAL,
};
