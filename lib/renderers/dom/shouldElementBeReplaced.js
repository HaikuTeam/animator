"use strict";
exports.__esModule = true;
var getFlexId_1 = require("./getFlexId");
function shouldElementBeReplaced(domElement, virtualElement) {
    var oldFlexId = getFlexId_1["default"](domElement);
    var newFlexId = getFlexId_1["default"](virtualElement);
    if (oldFlexId && newFlexId) {
        if (oldFlexId !== newFlexId) {
            return true;
        }
    }
    return false;
}
exports["default"] = shouldElementBeReplaced;
//# sourceMappingURL=shouldElementBeReplaced.js.map