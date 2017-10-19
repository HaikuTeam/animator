"use strict";
exports.__esModule = true;
var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
function createSvgElement(domElement, tagName) {
    return domElement.ownerDocument.createElementNS(SVG_NAMESPACE, tagName);
}
exports["default"] = createSvgElement;
//# sourceMappingURL=createSvgElement.js.map