"use strict";
exports.__esModule = true;
function cloneAttributes(attributes) {
    if (!attributes) {
        return {};
    }
    var clone = {};
    for (var key in attributes) {
        clone[key] = attributes[key];
    }
    return clone;
}
exports["default"] = cloneAttributes;
//# sourceMappingURL=cloneAttributes.js.map