/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

let computeMatrix = require("./layout/computeMatrix")
let computeRotationFlexibly = require("./layout/computeRotationFlexibly")
let computeSize = require("./layout/computeSize")

let ELEMENTS_2D = {
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
  svg: true,
  switch: true,
  symbol: true,
  text: true,
  textPath: true,
  tspan: true,
  unknown: true,
  use: true,
}

// Coordinate (0, 0, 0) is the top left of the screen

let SIZE_PROPORTIONAL = 0 // A percentage of the parent
let SIZE_ABSOLUTE = 1 // A fixed size in screen pixels
let DEFAULT_DEPTH = 0
let IDENTITY = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]

// Used for rendering downstream
let FORMATS = {
  THREE: 3,
  TWO: 2,
}

function initializeNodeAttributes(element, parent) {
  if (!element.attributes) element.attributes = {}
  if (!element.attributes.style) element.attributes.style = {}
  if (!element.layout) {
    element.layout = createLayoutSpec()
    element.layout.matrix = createMatrix()
    element.layout.format = ELEMENTS_2D[element.elementName]
      ? FORMATS.TWO
      : FORMATS.THREE
  }
  return element
}

function initializeTreeAttributes(tree, container) {
  if (!tree || typeof tree === "string") return
  initializeNodeAttributes(tree, container)
  tree.__parent = container
  if (!tree.children) return
  if (tree.children.length < 1) return
  for (let i = 0; i < tree.children.length; i++) {
    initializeTreeAttributes(tree.children[i], tree)
  }
}

// The layout specification naming in createLayoutSpec is derived in part from https://github.com/Famous/engine/blob/master/core/Transform.js which is MIT licensed.
// The MIT License (MIT)
// Copyright (c) 2015 Famous Industries Inc.
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"),
// to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
// and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.
function createLayoutSpec(ax, ay, az) {
  return {
    shown: true,
    opacity: 1.0,
    mount: { x: ax || 0, y: ay || 0, z: az || 0 }, // anchor in self
    align: { x: ax || 0, y: ay || 0, z: az || 0 }, // anchor in context
    origin: { x: ax || 0, y: ay || 0, z: az || 0 }, // transform origin
    translation: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0, w: 0 },
    scale: { x: 1, y: 1, z: 1 },
    sizeMode: {
      x: SIZE_PROPORTIONAL,
      y: SIZE_PROPORTIONAL,
      z: SIZE_PROPORTIONAL,
    },
    sizeProportional: { x: 1, y: 1, z: 1 },
    sizeDifferential: { x: 0, y: 0, z: 0 },
    sizeAbsolute: { x: 0, y: 0, z: 0 },
  }
}

function createMatrix() {
  return copyMatrix([], IDENTITY)
}

function copyMatrix(out, m) {
  out[0] = m[0]
  out[1] = m[1]
  out[2] = m[2]
  out[3] = m[3]
  out[4] = m[4]
  out[5] = m[5]
  out[6] = m[6]
  out[7] = m[7]
  out[8] = m[8]
  out[9] = m[9]
  out[10] = m[10]
  out[11] = m[11]
  out[12] = m[12]
  out[13] = m[13]
  out[14] = m[14]
  out[15] = m[15]
  return out
}

function multiplyMatrices(out, a, b) {
  out[0] = a[0] * b[0] + a[1] * b[4] + a[2] * b[8] + a[3] * b[12]
  out[1] = a[0] * b[1] + a[1] * b[5] + a[2] * b[9] + a[3] * b[13]
  out[2] = a[0] * b[2] + a[1] * b[6] + a[2] * b[10] + a[3] * b[14]
  out[3] = a[0] * b[3] + a[1] * b[7] + a[2] * b[11] + a[3] * b[15]
  out[4] = a[4] * b[0] + a[5] * b[4] + a[6] * b[8] + a[7] * b[12]
  out[5] = a[4] * b[1] + a[5] * b[5] + a[6] * b[9] + a[7] * b[13]
  out[6] = a[4] * b[2] + a[5] * b[6] + a[6] * b[10] + a[7] * b[14]
  out[7] = a[4] * b[3] + a[5] * b[7] + a[6] * b[11] + a[7] * b[15]
  out[8] = a[8] * b[0] + a[9] * b[4] + a[10] * b[8] + a[11] * b[12]
  out[9] = a[8] * b[1] + a[9] * b[5] + a[10] * b[9] + a[11] * b[13]
  out[10] = a[8] * b[2] + a[9] * b[6] + a[10] * b[10] + a[11] * b[14]
  out[11] = a[8] * b[3] + a[9] * b[7] + a[10] * b[11] + a[11] * b[15]
  out[12] = a[12] * b[0] + a[13] * b[4] + a[14] * b[8] + a[15] * b[12]
  out[13] = a[12] * b[1] + a[13] * b[5] + a[14] * b[9] + a[15] * b[13]
  out[14] = a[12] * b[2] + a[13] * b[6] + a[14] * b[10] + a[15] * b[14]
  out[15] = a[12] * b[3] + a[13] * b[7] + a[14] * b[11] + a[15] * b[15]
  return out
}

function transposeMatrix(out, a) {
  out[0] = a[0]
  out[1] = a[4]
  out[2] = a[8]
  out[3] = a[12]
  out[4] = a[1]
  out[5] = a[5]
  out[6] = a[9]
  out[7] = a[13]
  out[8] = a[2]
  out[9] = a[6]
  out[10] = a[10]
  out[11] = a[14]
  out[12] = a[3]
  out[13] = a[7]
  out[14] = a[11]
  out[15] = a[15]
  return out
}

function multiplyArrayOfMatrices(arrayOfMatrices) {
  let product = createMatrix()
  for (let i = 0; i < arrayOfMatrices.length; i++) {
    product = multiplyMatrices([], product, arrayOfMatrices[i])
  }
  return product
}

function isZero(num) {
  return num > -0.000001 && num < 0.000001
}

function createBaseComputedLayout(x, y, z) {
  if (!x) x = 0
  if (!y) y = 0
  if (!z) z = 0
  return {
    size: { x, y, z },
    matrix: createMatrix(),
    shown: true,
    opacity: 1.0,
  }
}

function computeLayout(
  out,
  layoutSpec,
  currentMatrix,
  parentMatrix,
  parentsizeAbsolute,
) {
  if (!parentsizeAbsolute) parentsizeAbsolute = { x: 0, y: 0, z: 0 }

  if (parentsizeAbsolute.z === undefined || parentsizeAbsolute.z === null) {
    parentsizeAbsolute.z = DEFAULT_DEPTH
  }

  let size = computeSize(
    {},
    layoutSpec,
    layoutSpec.sizeMode,
    parentsizeAbsolute,
  )

  let matrix = computeMatrix(
    [],
    out,
    layoutSpec,
    currentMatrix,
    size,
    parentMatrix,
    parentsizeAbsolute,
  )

  out.size = size
  out.matrix = matrix
  out.shown = layoutSpec.shown
  out.opacity = layoutSpec.opacity

  return out
}

module.exports = {
  computeMatrix,
  multiplyArrayOfMatrices,
  computeLayout,
  createLayoutSpec,
  createBaseComputedLayout,
  computeRotationFlexibly,
  createMatrix,
  FORMATS,
  SIZE_ABSOLUTE,
  SIZE_PROPORTIONAL,
  ATTRIBUTES: createLayoutSpec(),
  multiplyMatrices,
  transposeMatrix,
  copyMatrix,
  initializeTreeAttributes,
  initializeNodeAttributes,
  isZero,
}
