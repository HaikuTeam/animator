"use strict";
exports.__esModule = true;
var SIZE_PROPORTIONAL = 0;
var SIZE_ABSOLUTE = 1;
var SIZING_COMPONENTS = ['x', 'y', 'z'];
function computeSize(outputSize, layoutSpec, sizeModeArray, parentsizeAbsolute) {
    for (var i = 0; i < SIZING_COMPONENTS.length; i++) {
        var component = SIZING_COMPONENTS[i];
        switch (sizeModeArray[component]) {
            case SIZE_PROPORTIONAL:
                var sizeProportional = layoutSpec.sizeProportional[component];
                var sizeDifferential = layoutSpec.sizeDifferential[component];
                outputSize[component] =
                    parentsizeAbsolute[component] * sizeProportional + sizeDifferential;
                break;
            case SIZE_ABSOLUTE:
                outputSize[component] = layoutSpec.sizeAbsolute[component];
                break;
        }
    }
    return outputSize;
}
exports["default"] = computeSize;
//# sourceMappingURL=computeSize.js.map