"use strict";
exports.__esModule = true;
var cloneAttributes_1 = require("./cloneAttributes");
function cloneVirtualElement(virtualElement) {
    return {
        elementName: virtualElement.elementName,
        attributes: cloneAttributes_1["default"](virtualElement.attributes),
        children: virtualElement.children
    };
}
exports["default"] = cloneVirtualElement;
//# sourceMappingURL=cloneVirtualElement.js.map