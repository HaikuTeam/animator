/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var Layout3D = require('./../Layout3D');

var ELEMENTS_2D = {
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
  use: true
};

function initializeNodeAttributes(element, parent) {
  if (!element.attributes) element.attributes = {};
  if (!element.attributes.style) element.attributes.style = {};
  if (!element.layout) {
    element.layout = Layout3D.createLayoutSpec();
    element.layout.matrix = Layout3D.createMatrix();
    element.layout.format = ELEMENTS_2D[element.elementName]
      ? Layout3D.FORMATS.TWO
      : Layout3D.FORMATS.THREE;
  }
  return element;
}

module.exports = function initializeTreeAttributes(tree, container) {
  if (!tree || typeof tree === 'string') return;
  initializeNodeAttributes(tree, container);
  tree.__parent = container;
  if (!tree.children) return;
  if (tree.children.length < 1) return;
  for (var i = 0; i < tree.children.length; i++)
    initializeTreeAttributes(tree.children[i], tree);
};
