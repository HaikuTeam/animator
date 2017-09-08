/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var isBlankString = require('./isBlankString')
var removeElement = require('./removeElement')
var _cloneVirtualElement = require('./cloneVirtualElement')
var getFlexId = require('./getFlexId')
var shouldElementBeReplaced = require('./shouldElementBeReplaced')

function renderTree (
  domElement,
  virtualElement,
  virtualChildren,
  component,
  isPatchOperation,
  doSkipChildren
) {
  component._addElementToHashTable(domElement, virtualElement)

  if (!domElement.haiku) domElement.haiku = {}

  // E.g. I might want to inspect the dom node, grab the haiku source data, etc.
  virtualElement.__target = domElement
  domElement.haiku.virtual = virtualElement
  domElement.haiku.element = _cloneVirtualElement(virtualElement) // Must clone so we get a correct picture of differences in attributes between runs, e.g. for detecting attribute removals
  if (!component.config.options.cache[getFlexId(virtualElement)]) {
    component.config.options.cache[getFlexId(virtualElement)] = {}
  }

  if (!Array.isArray(virtualChildren)) {
    return domElement
  }

  // For so-called 'horizon' elements, we assume that we've ceded control to another renderer,
  // so the most we want to do is update the attributes and layout properties, but leave the rest alone
  if (component._isHorizonElement(virtualElement)) {
    return domElement
  }

  // During patch renders we don't want to drill down and update children as
  // we're just going to end up doing a lot of unnecessary DOM writes
  if (doSkipChildren) {
    return domElement
  }

  while (virtualChildren.length > 0 && isBlankString(virtualChildren[0])) {
    virtualChildren.shift()
  }

  // Store a copy of the array here, otherwise we can hit a race where as we remove
  // elements from the DOM, the childNodes array gets shifted and the indices get offset, leading
  // to removals not occurring properly
  var domChildNodes = []
  for (var k = 0; k < domElement.childNodes.length; k++) {
    domChildNodes[k] = domElement.childNodes[k]
  }

  var max = virtualChildren.length
  if (max < domChildNodes.length) {
    max = domChildNodes.length
  }

  for (var i = 0; i < max; i++) {
    var virtualChild = virtualChildren[i]
    var domChild = domChildNodes[i]

    if (!virtualChild && !domChild) {
      // empty
    } else if (!virtualChild && domChild) {
      removeElement(domChild)
    } else if (virtualChild) {
      if (!domChild) {
        var insertedElement = appendChild(
          null,
          virtualChild,
          domElement,
          virtualElement,
          component
        )

        component._addElementToHashTable(insertedElement, virtualChild)
      } else {
        // Circumstances in which we want to completely *replace* the element:
        // - We see that our cached target element is not the one at this location
        // - We see that the DOM id doesn't match the incoming one
        // - we see that the haiku-id doesn't match the incoming one.
        // If we now have an element that is different, we need to trigger a full re-render
        // of itself and all of its children, because e.g. url(#...) references will retain pointers to
        // old elements and this is the only way to clear the DOM to get a correct render.
        if (shouldElementBeReplaced(domChild, virtualChild)) {
          replaceElement(
            domChild,
            virtualChild,
            domElement,
            virtualElement,
            component
          )
        } else {
          updateElement(
            domChild,
            virtualChild,
            domElement,
            virtualElement,
            component,
            isPatchOperation
          )
        }
      }
    }
  }

  return domElement
}

module.exports = renderTree

var appendChild = require('./appendChild')
var updateElement = require('./updateElement')
var replaceElement = require('./replaceElement')
