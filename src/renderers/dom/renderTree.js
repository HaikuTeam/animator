/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var isBlankString = require('./isBlankString');
var removeElement = require('./removeElement');
var locatorBump = require('./locatorBump');

function _cloneVirtualElement(virtualElement) {
  return {
    elementName: virtualElement.elementName,
    attributes: _cloneAttributes(virtualElement.attributes),
    children: virtualElement.children
  };
}

function _cloneAttributes(attributes) {
  if (!attributes) return {};
  var clone = {};
  for (var key in attributes)
    clone[key] = attributes[key];
  return clone;
}

function renderTree(
  domElement,
  virtualElement,
  virtualChildren,
  locator,
  hash,
  options,
  scopes,
  isPatchOperation
) {
  hash[locator] = domElement;

  if (!domElement.haiku) domElement.haiku = {};
  domElement.haiku.locator = locator;

  // Must clone so we get a correct picture of differences in attributes between runs, e.g. for detecting attribute removals
  domElement.haiku.element = _cloneVirtualElement(virtualElement);

  if (!Array.isArray(virtualChildren)) {
    return domElement;
  }

  while (virtualChildren.length > 0 && isBlankString(virtualChildren[0])) {
    virtualChildren.shift();
  }

  var max = virtualChildren.length;
  if (max < domElement.childNodes.length) max = domElement.childNodes.length;

  for (var i = 0; i < max; i++) {
    var virtualChild = virtualChildren[i];
    var domChild = domElement.childNodes[i];
    var sublocator = locatorBump(locator, i);

    if (virtualChild && options.modifier) {
      var virtualReplacement = options.modifier(virtualChild);
      if (virtualReplacement !== undefined) {
        virtualChild = virtualReplacement;
      }
    }

    if (!virtualChild && !domChild) {
      continue;
    } else if (!virtualChild && domChild) {
      removeElement(domChild, hash, options, scopes);
      delete hash[sublocator];
    } else if (virtualChild && !domChild) {
      var insertedElement = appendChild(
        null,
        virtualChild,
        domElement,
        virtualElement,
        sublocator,
        hash,
        options,
        scopes
      );
      hash[sublocator] = insertedElement;
    } else {
      if (!domChild.haiku) domChild.haiku = {};
      domChild.haiku.locator = sublocator;

      if (!domChild.haiku.element) {
        // Must clone so we get a correct picture of differences in attributes between runs, e.g. for detecting attribute removals
        domChild.haiku.element = _cloneVirtualElement(virtualChild);
      }

      updateElement(
        domChild,
        virtualChild,
        domElement,
        virtualElement,
        sublocator,
        hash,
        options,
        scopes,
        isPatchOperation
      );
    }
  }

  return domElement;
}

module.exports = renderTree;

var appendChild = require('./appendChild');
var updateElement = require('./updateElement');
