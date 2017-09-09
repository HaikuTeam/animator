"use strict";
exports.__esModule = true;
function isEdge(window) {
    if (!window)
        return false;
    if (!window.navigator)
        return false;
    if (!window.navigator.userAgent)
        return false;
    return /Edge\/\d./i.test(window.navigator.userAgent);
}
exports["default"] = isEdge;
//# sourceMappingURL=isEdge.js.map