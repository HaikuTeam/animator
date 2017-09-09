"use strict";
exports.__esModule = true;
var updateElement_1 = require("./updateElement");
function patch(topLevelDomElement, virtualContainer, patchesDict, component) {
    if (!patchesDict) {
        return topLevelDomElement;
    }
    var keysToUpdate = Object.keys(patchesDict);
    if (keysToUpdate.length < 1) {
        return topLevelDomElement;
    }
    for (var flexId in patchesDict) {
        var virtualElement = patchesDict[flexId];
        var domElements = component._getRealElementsAtId(flexId);
        var nestedModuleElement = component._nestedComponentElements[flexId];
        for (var i = 0; i < domElements.length; i++) {
            var domElement = domElements[i];
            updateElement_1["default"](domElement, virtualElement, domElement.parentNode, virtualElement.__parent, component, true);
            if (nestedModuleElement && nestedModuleElement.__instance) {
                patch(domElement, nestedModuleElement, nestedModuleElement.__instance._getPrecalcedPatches(), nestedModuleElement.__instance);
            }
        }
    }
}
exports["default"] = patch;
//# sourceMappingURL=patch.js.map