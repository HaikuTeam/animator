/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var updateElement = require('./updateElement')

function patch (
  topLevelDomElement,
  virtualContainer,
  patchesDict,
  locator,
  context
) {
  if (Object.keys(patchesDict) < 1) {
    return topLevelDomElement
  }

  for (var flexId in patchesDict) {
    var virtualElement = patchesDict[flexId]

    if (context._hash[flexId] && context._hash[flexId].length > 0) {
      for (var i = 0; i < context._hash[flexId].length; i++) {
        var domElement = context._hash[flexId][i]

        updateElement(
          domElement,
          virtualElement,
          domElement.parentNode,
          virtualElement.__parent,
          domElement.haiku.locator,
          context,
          true
        )
      }
    }
  }
}

module.exports = patch
