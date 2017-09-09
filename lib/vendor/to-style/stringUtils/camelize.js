"use strict";
exports.__esModule = true;
var hyphenRe = /[-\s]+(.)?/g;
function toCamelFn(str, letter) {
    return letter ? letter.toUpperCase() : "";
}
function camelize(str) {
    return str ? str.replace(hyphenRe, toCamelFn) : "";
}
exports["default"] = camelize;
//# sourceMappingURL=camelize.js.map