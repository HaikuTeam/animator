/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var updateElement = require('./updateElement')

function patch (
  topLevelDomElement,
  virtualContainer,
  patchesDict,
  locator,
  component
) {
  var keysToUpdate = Object.keys(patchesDict)
  if (keysToUpdate.length < 1) {
    return topLevelDomElement
  }

  for (var flexId in patchesDict) {
    var virtualElement = patchesDict[flexId]
    var domElements = component._getRealElementsAtId(flexId)
    for (var i = 0; i < domElements.length; i++) {
      updateElement(
        domElements[i],
        virtualElement,
        domElements[i].parentNode,
        virtualElement.__parent,
        domElements[i].haiku.locator,
        component,
        true
      )
    }
  }
}

module.exports = patch
