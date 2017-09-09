"use strict";
exports.__esModule = true;
function isMobile(window) {
    if (!window)
        return false;
    if (!window.navigator)
        return false;
    if (!window.navigator.userAgent)
        return false;
    return /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);
}
exports["default"] = isMobile;
//# sourceMappingURL=isMobile.js.map