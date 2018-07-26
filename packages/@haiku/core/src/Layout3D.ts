/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import {
  LayoutSpec,
  ThreeDimensionalLayoutProperty,
} from './api';

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

export const AUTO_SIZING_TOKEN = 'auto';

// Coordinate (0, 0, 0) is the top left of the screen

export const SIZE_PROPORTIONAL = 0; // A percentage of the parent
export const SIZE_ABSOLUTE = 1; // A fixed size in screen pixels
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

const initializeNodeAttributes = (node, isRootNode: boolean) => {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (!node.attributes) {
    node.attributes = {};
  }

  if (!node.attributes.style) {
    node.attributes.style = {};
  }

  if (!node.layout) {
    node.layout = createLayoutSpec(!isRootNode && virtualElementIsLayoutContainer(node));
    node.layout.matrix = createMatrix();
    node.layout.format = ELEMENTS_2D[node.elementName]
      ? FORMATS.TWO
      : FORMATS.THREE;
  }

  return node;
};

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

const computeOrthonormalBasisMatrix = (rotation, shear) => {
  const orthonormalBasisLayout = {
    ...createLayoutSpec(),
    rotation,
    shear,
  };
  const ignoredSize = {x: 0, y: 0, z: 0};
  return computeMatrix(orthonormalBasisLayout, ignoredSize);
};

const computeScaledBasisMatrix = (rotation, scale, shear) => {
  const scaledBasisLayout = {
    ...createLayoutSpec(),
    rotation,
    scale,
    shear,
  };
  const ignoredSize = {x: 0, y: 0, z: 0};
  return computeMatrix(scaledBasisLayout, ignoredSize);
};

const clone = (layout) => {
  if (!layout) {
    return layout;
  }

  const out = {
    shown: layout.shown,
    opacity: layout.opacity,
    mount: Object.assign({}, layout.mount),
    offset: Object.assign({}, layout.offset),
    origin: Object.assign({}, layout.origin),
    translation: Object.assign({}, layout.translation),
    rotation: Object.assign({}, layout.rotation),
    scale: Object.assign({}, layout.scale),
    shear: Object.assign({}, layout.shear),
    sizeMode: Object.assign({}, layout.sizeMode),
    sizeProportional: Object.assign({}, layout.sizeProportional),
    sizeDifferential: Object.assign({}, layout.sizeDifferential),
    sizeAbsolute: Object.assign({}, layout.sizeAbsolute),
    size: null,
    matrix: null,
    computed: null,
  };

  if (layout.computed) {
    out.computed = clone(layout.computed);
  }

  // Handle either a raw layout (no size or matrix) or a computed one (has size and matrix)
  if (layout.matrix) {
    out.matrix = layout.matrix.map((n) => n);
  }
  if (layout.size) {
    out.size = Object.assign({}, layout.size);
  }

  return out;
};

/**
 * The code below includes modified code from https://github.com/famous/engine
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

const createLayoutSpec = (createCoordinateSystem?: boolean): LayoutSpec => ({
  shown: true,
  opacity: 1.0,
  offset: {x: 0, y: 0, z: 0},
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

const computeMatrix = (
  layoutSpec: LayoutSpec,
  targetSize: ThreeDimensionalLayoutProperty,
) => {
  const originX = layoutSpec.origin.x * targetSize.x;
  const originY = layoutSpec.origin.y * targetSize.y;
  const originZ = layoutSpec.origin.z * targetSize.z;

  layoutSpec.orientation = computeOrientationFlexibly(
    layoutSpec.rotation.x,
    layoutSpec.rotation.y,
    layoutSpec.rotation.z,
  );

  const wx = layoutSpec.orientation.w * layoutSpec.orientation.x;
  const wy = layoutSpec.orientation.w * layoutSpec.orientation.y;
  const wz = layoutSpec.orientation.w * layoutSpec.orientation.z;
  const xx = layoutSpec.orientation.x * layoutSpec.orientation.x;
  const yy = layoutSpec.orientation.y * layoutSpec.orientation.y;
  const zz = layoutSpec.orientation.z * layoutSpec.orientation.z;
  const xy = layoutSpec.orientation.x * layoutSpec.orientation.y;
  const xz = layoutSpec.orientation.x * layoutSpec.orientation.z;
  const yz = layoutSpec.orientation.y * layoutSpec.orientation.z;

  let rs0 = (1 - 2 * (yy + zz));
  let rs1 = 2 * (xy + wz);
  let rs2 = 2 * (xz - wy);
  let rs3 = 2 * (xy - wz);
  let rs4 = (1 - 2 * (xx + zz));
  let rs5 = 2 * (yz + wx);
  let rs6 = 2 * (xz + wy);
  let rs7 = 2 * (yz - wx);
  let rs8 = (1 - 2 * (xx + yy));

  if (layoutSpec.shear.xy || layoutSpec.shear.xz || layoutSpec.shear.yz) {
    const shearXzProxy = layoutSpec.shear.xy * layoutSpec.shear.yz + layoutSpec.shear.xz;
    rs6 += layoutSpec.shear.yz * rs3 + shearXzProxy * rs0;
    rs7 += layoutSpec.shear.yz * rs4 + shearXzProxy * rs1;
    rs8 += layoutSpec.shear.yz * rs5 + shearXzProxy * rs2;
    rs3 += layoutSpec.shear.xy * rs0;
    rs4 += layoutSpec.shear.xy * rs1;
    rs5 += layoutSpec.shear.xy * rs2;
  }

  rs0 *= layoutSpec.scale.x;
  rs1 *= layoutSpec.scale.x;
  rs2 *= layoutSpec.scale.x;
  rs3 *= layoutSpec.scale.y;
  rs4 *= layoutSpec.scale.y;
  rs5 *= layoutSpec.scale.y;
  rs6 *= layoutSpec.scale.z;
  rs7 *= layoutSpec.scale.z;
  rs8 *= layoutSpec.scale.z;
  const tx =
    layoutSpec.offset.x +
    layoutSpec.translation.x -
    (rs0 * originX + rs3 * originY + rs6 * originZ);
  const ty =
    layoutSpec.offset.y +
    layoutSpec.translation.y -
    (rs1 * originX + rs4 * originY + rs7 * originZ);
  const tz =
    layoutSpec.offset.z +
    layoutSpec.translation.z -
    (rs2 * originX + rs5 * originY + rs8 * originZ);

  return [rs0, rs1, rs2, 0, rs3, rs4, rs5, 0, rs6, rs7, rs8, 0, tx, ty, tz, 1];
};

const computeOrientationFlexibly = (x: number, y: number, z: number) => {
  if (x === 0 && y === 0 && z === 0) {
    return {x, y, z, w: 1};
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
};

export default {
  multiplyArrayOfMatrices,
  clone,
  computeMatrix,
  computeOrientationFlexibly,
  computeOrthonormalBasisMatrix,
  computeScaledBasisMatrix,
  createLayoutSpec,
  createMatrix,
  copyMatrix,
  initializeNodeAttributes,
  virtualElementIsLayoutContainer,
  FORMATS,
  SIZE_ABSOLUTE,
  SIZE_PROPORTIONAL,
};
