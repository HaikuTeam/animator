"use strict";
exports.__esModule = true;
var applyLayout_1 = require("./applyLayout");
var isTextNode_1 = require("./isTextNode");
var createTextNode_1 = require("./createTextNode");
var createTagNode_1 = require("./createTagNode");
function replaceElement(domElement, virtualElement, parentDomNode, parentVirtualElement, component) {
    var newElement;
    if (isTextNode_1["default"](virtualElement)) {
        newElement = createTextNode_1["default"](domElement, virtualElement);
    }
    else {
        newElement = createTagNode_1["default"](domElement, virtualElement, parentVirtualElement, component);
    }
    applyLayout_1["default"](newElement, virtualElement, parentDomNode, parentVirtualElement, component, null, null);
    parentDomNode.replaceChild(newElement, domElement);
    return newElement;
}
exports["default"] = replaceElement;
//# sourceMappingURL=replaceElement.js.map