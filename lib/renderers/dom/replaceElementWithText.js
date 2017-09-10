"use strict";
exports.__esModule = true;
var createTextNode_1 = require("./createTextNode");
function replaceElementWithText(domElement, textContent, component) {
    if (domElement) {
        if (domElement.textContent !== textContent) {
            var parentNode = domElement.parentNode;
            var textNode = createTextNode_1["default"](domElement, textContent);
            parentNode.replaceChild(textNode, domElement);
        }
    }
    return domElement;
}
exports["default"] = replaceElementWithText;
//# sourceMappingURL=replaceElementWithText.js.map