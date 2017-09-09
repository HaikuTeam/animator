"use strict";
exports.__esModule = true;
var createTextNode_1 = require("./createTextNode");
var createTagNode_1 = require("./createTagNode");
var applyLayout_1 = require("./applyLayout");
var isTextNode_1 = require("./isTextNode");
function appendChild(alreadyChildElement, virtualElement, parentDomElement, parentVirtualElement, component) {
    var domElementToInsert;
    if (isTextNode_1["default"](virtualElement)) {
        domElementToInsert = createTextNode_1["default"](parentDomElement, virtualElement);
    }
    else {
        domElementToInsert = createTagNode_1["default"](parentDomElement, virtualElement, parentVirtualElement, component);
    }
    applyLayout_1["default"](domElementToInsert, virtualElement, parentDomElement, parentVirtualElement, component, null, null);
    parentDomElement.appendChild(domElementToInsert);
    return domElementToInsert;
}
exports["default"] = appendChild;
//# sourceMappingURL=appendChild.js.map