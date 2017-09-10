"use strict";
exports.__esModule = true;
var appendChild_1 = require("./appendChild");
var cloneVirtualElement_1 = require("./cloneVirtualElement");
var getFlexId_1 = require("./getFlexId");
var isBlankString_1 = require("./isBlankString");
var removeElement_1 = require("./removeElement");
var replaceElement_1 = require("./replaceElement");
var shouldElementBeReplaced_1 = require("./shouldElementBeReplaced");
var updateElement_1 = require("./updateElement");
function renderTree(domElement, virtualElement, virtualChildren, component, isPatchOperation, doSkipChildren) {
    component._addElementToHashTable(domElement, virtualElement);
    if (!domElement.haiku)
        domElement.haiku = {};
    virtualElement.__target = domElement;
    domElement.haiku.virtual = virtualElement;
    domElement.haiku.element = cloneVirtualElement_1["default"](virtualElement);
    if (!component.config.options.cache[getFlexId_1["default"](virtualElement)]) {
        component.config.options.cache[getFlexId_1["default"](virtualElement)] = {};
    }
    if (!Array.isArray(virtualChildren)) {
        return domElement;
    }
    if (component._isHorizonElement(virtualElement)) {
        return domElement;
    }
    if (doSkipChildren) {
        return domElement;
    }
    while (virtualChildren.length > 0 && isBlankString_1["default"](virtualChildren[0])) {
        virtualChildren.shift();
    }
    var domChildNodes = [];
    for (var k = 0; k < domElement.childNodes.length; k++) {
        domChildNodes[k] = domElement.childNodes[k];
    }
    var max = virtualChildren.length;
    if (max < domChildNodes.length) {
        max = domChildNodes.length;
    }
    for (var i = 0; i < max; i++) {
        var virtualChild = virtualChildren[i];
        var domChild = domChildNodes[i];
        if (!virtualChild && !domChild) {
        }
        else if (!virtualChild && domChild) {
            removeElement_1["default"](domChild);
        }
        else if (virtualChild) {
            if (!domChild) {
                var insertedElement = appendChild_1["default"](null, virtualChild, domElement, virtualElement, component);
                component._addElementToHashTable(insertedElement, virtualChild);
            }
            else {
                if (shouldElementBeReplaced_1["default"](domChild, virtualChild)) {
                    replaceElement_1["default"](domChild, virtualChild, domElement, virtualElement, component);
                }
                else {
                    updateElement_1["default"](domChild, virtualChild, domElement, virtualElement, component, isPatchOperation);
                }
            }
        }
    }
    return domElement;
}
exports["default"] = renderTree;
//# sourceMappingURL=renderTree.js.map