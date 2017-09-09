"use strict";
exports.__esModule = true;
var createTextNode_1 = require("./createTextNode");
function insertTextChild(domElement, index, textContent) {
    var existingChild = domElement.childNodes[index];
    if (existingChild && existingChild.textContent === textContent) {
        return domElement;
    }
    if (existingChild) {
        var textNode = createTextNode_1["default"](domElement, textContent);
        domElement.replaceChild(textNode, existingChild);
        return domElement;
    }
    return domElement;
}
exports["default"] = insertTextChild;
//# sourceMappingURL=insertTextChild.js.map