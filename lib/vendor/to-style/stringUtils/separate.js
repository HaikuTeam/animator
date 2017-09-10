"use strict";
exports.__esModule = true;
var doubleColonRe = /::/g;
var upperToLowerRe = /([A-Z]+)([A-Z][a-z])/g;
var lowerToUpperRe = /([a-z\d])([A-Z])/g;
var underscoreToDashRe = /_/g;
function separate(name, separator) {
    return name
        ? name
            .replace(doubleColonRe, "/")
            .replace(upperToLowerRe, "$1_$2")
            .replace(lowerToUpperRe, "$1_$2")
            .replace(underscoreToDashRe, separator || "-")
        : "";
}
exports["default"] = separate;
//# sourceMappingURL=separate.js.map