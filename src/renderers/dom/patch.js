/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var updateElement = require('./updateElement')

function patch (
  topLevelDomElement,
  virtualContainer,
  patchesDict,
  locator,
  hash,
  options,
  scopes
) {
  if (Object.keys(patchesDict) < 1) {
    return topLevelDomElement
  }

  for (var flexId in patchesDict) {
    var virtualElement = patchesDict[flexId]

    if (virtualElement && options.modifier) {
      var virtualReplacement = options.modifier(virtualElement)
      if (virtualReplacement !== undefined) {
        virtualElement = virtualReplacement
      }
    }

    if (hash[flexId] && hash[flexId].length > 0) {
      for (var i = 0; i < hash[flexId].length; i++) {
        var domElement = hash[flexId][i]
        updateElement(
          domElement,
          virtualElement,
          domElement.parentNode,
          virtualElement.__parent,
          domElement.haiku.locator,
          hash,
          options,
          scopes,
          true
        )
      }
    }
  }
}

module.exports = patch
