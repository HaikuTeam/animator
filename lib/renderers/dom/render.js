"use strict";
exports.__esModule = true;
var renderTree_1 = require("./renderTree");
function render(domElement, virtualContainer, virtualTree, component) {
    return renderTree_1["default"](domElement, virtualContainer, [virtualTree], component, null, null);
}
exports["default"] = render;
//# sourceMappingURL=render.js.map