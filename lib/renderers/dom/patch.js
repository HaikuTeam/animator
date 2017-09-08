/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

var updateElement = require('./updateElement')

function patch (
  topLevelDomElement,
  virtualContainer,
  patchesDict,
  component
) {
  // Just in case we get a null which might be set as a no-op signal by a component upstream
  if (!patchesDict) {
    return topLevelDomElement
  }

  var keysToUpdate = Object.keys(patchesDict)
  if (keysToUpdate.length < 1) {
    return topLevelDomElement
  }

  for (var flexId in patchesDict) {
    var virtualElement = patchesDict[flexId]

    var domElements = component._getRealElementsAtId(flexId)

    var nestedModuleElement = component._nestedComponentElements[flexId]

    for (var i = 0; i < domElements.length; i++) {
      var domElement = domElements[i]
      updateElement(
        domElement,
        virtualElement,
        domElement.parentNode,
        virtualElement.__parent,
        component,
        true
      )

      // If there is a nested component at this location, let it patch inside its scope
      if (nestedModuleElement && nestedModuleElement.__instance) {
        patch(
          domElement,
          nestedModuleElement, // Sizing info is stored here
          nestedModuleElement.__instance._getPrecalcedPatches(),
          nestedModuleElement.__instance
        )
      }
    }
  }
}

module.exports = patch
