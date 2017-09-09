"use strict";
exports.__esModule = true;
function normalizeName(tagName) {
    if (tagName[0] === tagName[0].toUpperCase())
        tagName = tagName + "-component";
    return tagName;
}
exports["default"] = normalizeName;
//# sourceMappingURL=normalizeName.js.map