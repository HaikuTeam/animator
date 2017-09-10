"use strict";
exports.__esModule = true;
function isIE(window) {
    if (!window)
        return false;
    if (!window.navigator)
        return false;
    if (!window.navigator.userAgent)
        return false;
    return (window.navigator.userAgent.indexOf("MSIE") !== -1 ||
        navigator.appVersion.indexOf("Trident") > 0);
}
exports["default"] = isIE;
//# sourceMappingURL=isIE.js.map