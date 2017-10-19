"use strict";
exports.__esModule = true;
var applyLayout_1 = require("./applyLayout");
var assignAttributes_1 = require("./assignAttributes");
var cloneVirtualElement_1 = require("./cloneVirtualElement");
var getFlexId_1 = require("./getFlexId");
var getTypeAsString_1 = require("./getTypeAsString");
var isTextNode_1 = require("./isTextNode");
var normalizeName_1 = require("./normalizeName");
var renderTree_1 = require("./renderTree");
var replaceElement_1 = require("./replaceElement");
var replaceElementWithText_1 = require("./replaceElementWithText");
var OBJECT = 'object';
var STRING = 'string';
function updateElement(domElement, virtualElement, parentNode, parentVirtualElement, component, isPatchOperation) {
    if (isTextNode_1["default"](virtualElement)) {
        replaceElementWithText_1["default"](domElement, virtualElement, component);
        return virtualElement;
    }
    if (!domElement.haiku) {
        domElement.haiku = {};
    }
    if (!component.config.options.cache[getFlexId_1["default"](virtualElement)]) {
        component.config.options.cache[getFlexId_1["default"](virtualElement)] = {};
    }
    if (!domElement.haiku.element) {
        domElement.haiku.element = cloneVirtualElement_1["default"](virtualElement);
    }
    var domTagName = domElement.tagName.toLowerCase().trim();
    var elName = normalizeName_1["default"](getTypeAsString_1["default"](virtualElement));
    var virtualElementTagName = elName.toLowerCase().trim();
    var incomingKey = virtualElement.key ||
        (virtualElement.attributes && virtualElement.attributes.key);
    var existingKey = domElement.haiku && domElement.haiku.key;
    var isKeyDifferent = incomingKey !== null &&
        incomingKey !== undefined &&
        incomingKey !== existingKey;
    if (!component._isHorizonElement(virtualElement)) {
        if (domTagName !== virtualElementTagName) {
            return replaceElement_1["default"](domElement, virtualElement, parentNode, parentVirtualElement, component);
        }
        if (isKeyDifferent) {
            return replaceElement_1["default"](domElement, virtualElement, parentNode, parentVirtualElement, component);
        }
    }
    if (virtualElement.attributes &&
        typeof virtualElement.attributes === OBJECT) {
        assignAttributes_1["default"](domElement, virtualElement, component, isPatchOperation, isKeyDifferent);
    }
    applyLayout_1["default"](domElement, virtualElement, parentNode, parentVirtualElement, component, isPatchOperation, isKeyDifferent);
    if (incomingKey !== undefined && incomingKey !== null) {
        domElement.haiku.key = incomingKey;
    }
    var subcomponent = (virtualElement && virtualElement.__instance) || component;
    if (Array.isArray(virtualElement.children)) {
        var doSkipChildren = isPatchOperation && (typeof virtualElement.children[0] !== STRING);
        renderTree_1["default"](domElement, virtualElement, virtualElement.children, subcomponent, isPatchOperation, doSkipChildren);
    }
    else if (!virtualElement.children) {
        renderTree_1["default"](domElement, virtualElement, [], subcomponent, isPatchOperation, null);
    }
    return domElement;
}
exports["default"] = updateElement;
//# sourceMappingURL=updateElement.js.map