/**
 * Copyright (c) Haiku 2016-2017. All rights reserved.
 */

import updateElement from "./updateElement"

export default function patch(
  topLevelDomElement,
  virtualContainer,
  patchesDict,
  component,
) {
  // Just in case we get a null which might be set as a no-op signal by a component upstream
  if (!patchesDict) {
    return topLevelDomElement
  }

  let keysToUpdate = Object.keys(patchesDict)
  if (keysToUpdate.length < 1) {
    return topLevelDomElement
  }

  for (let flexId in patchesDict) {
    let virtualElement = patchesDict[flexId]

    let domElements = component._getRealElementsAtId(flexId)

    let nestedModuleElement = component._nestedComponentElements[flexId]

    for (let i = 0; i < domElements.length; i++) {
      let domElement = domElements[i]

      updateElement(
        domElement,
        virtualElement,
        domElement.parentNode,
        virtualElement.__parent,
        component,
        true,
      )

      // If there is a nested component at this location, let it patch inside its scope
      if (nestedModuleElement && nestedModuleElement.__instance) {
        patch(
          domElement,
          nestedModuleElement, // Sizing info is stored here
          nestedModuleElement.__instance._getPrecalcedPatches(),
          nestedModuleElement.__instance,
        )
      }
    }
  }
}
