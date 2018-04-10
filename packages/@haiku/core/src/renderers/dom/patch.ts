/**
 * Copyright (c) Haiku 2016-2018. All rights reserved.
 */

import updateElement from './updateElement';

export default function patch(topLevelDomElement, patchesDict, component) {
  // Just in case we get a null which might be set as a no-op signal by a component upstream
  if (!patchesDict) {
    return topLevelDomElement;
  }

  const keysToUpdate = Object.keys(patchesDict);
  if (keysToUpdate.length < 1) {
    return topLevelDomElement;
  }

  for (const flexId in patchesDict) {
    const virtualElement = patchesDict[flexId];

    const domElement = component._getRealElementAtId(flexId);

    if (domElement) {
      const nestedModuleElement = component.nestedComponentElements[flexId];

      updateElement(
        domElement,
        virtualElement,
        domElement.parentNode,
        virtualElement.__parent,
        component,
        true,
      );

      // If there is a nested component at this location, let it patch inside its scope
      if (nestedModuleElement && nestedModuleElement.__instance) {
        patch(
          domElement,
          nestedModuleElement.__instance._getPrecalcedPatches(),
          nestedModuleElement.__instance,
        );
      }
    }
  }
}
