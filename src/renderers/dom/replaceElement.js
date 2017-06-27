/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var applyLayout = require('./applyLayout');
var isTextNode = require('./isTextNode');

function replaceElement(
  domElement,
  virtualElement,
  parentDomNode,
  parentVirtualElement,
  locator,
  hash,
  options,
  scopes
) {
  var newElement;
  if (isTextNode(virtualElement))
    newElement = createTextNode(domElement, virtualElement, options, scopes);
  else
    newElement = createTagNode(
      domElement,
      virtualElement,
      parentVirtualElement,
      locator,
      hash,
      options,
      scopes
    );

  applyLayout(
    newElement,
    virtualElement,
    parentDomNode,
    parentVirtualElement,
    options,
    scopes
  );

  parentDomNode.replaceChild(newElement, domElement);
  return newElement;
}

module.exports = replaceElement;

var createTextNode = require('./createTextNode');
var createTagNode = require('./createTagNode');
