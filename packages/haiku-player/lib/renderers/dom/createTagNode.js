"use strict";
exports.__esModule = true;
var normalizeName_1 = require("./normalizeName");
var getTypeAsString_1 = require("./getTypeAsString");
var getFlexId_1 = require("./getFlexId");
var allSvgElementNames_1 = require("./../../helpers/allSvgElementNames");
var createSvgElement_1 = require("./createSvgElement");
var updateElement_1 = require("./updateElement");
function createTagNode(domElement, virtualElement, parentVirtualElement, component) {
    var tagName = normalizeName_1["default"](getTypeAsString_1["default"](virtualElement));
    var newDomElement;
    if (allSvgElementNames_1["default"][tagName]) {
        newDomElement = createSvgElement_1["default"](domElement, tagName);
    }
    else {
        newDomElement = domElement.ownerDocument.createElement(tagName);
    }
    if (!newDomElement.haiku)
        newDomElement.haiku = {};
    if (!component.config.options.cache[getFlexId_1["default"](virtualElement)]) {
        component.config.options.cache[getFlexId_1["default"](virtualElement)] = {};
    }
    var incomingKey = virtualElement.key ||
        (virtualElement.attributes && virtualElement.attributes.key);
    if (incomingKey !== undefined && incomingKey !== null) {
        newDomElement.haiku.key = incomingKey;
    }
    updateElement_1["default"](newDomElement, virtualElement, domElement, parentVirtualElement, component, null);
    return newDomElement;
}
exports["default"] = createTagNode;
//# sourceMappingURL=createTagNode.js.map