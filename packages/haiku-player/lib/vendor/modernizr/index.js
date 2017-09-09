"use strict";
exports.__esModule = true;
function hasPreserve3d(window) {
    if (!window)
        return false;
    if (!window.document)
        return false;
    var outerAnchor;
    var innerAnchor;
    var CSS = window.CSS;
    var result = false;
    var tmp;
    if (CSS && CSS.supports && CSS.supports("(transform-style: preserve-3d)")) {
        return true;
    }
    outerAnchor = window.document.createElement("a");
    innerAnchor = window.document.createElement("a");
    outerAnchor.style.cssText =
        "display: block; transform-style: preserve-3d; transform-origin: right; transform: rotateY(40deg);";
    innerAnchor.style.cssText =
        "display: block; width: 9px; height: 1px; background: #000; transform-origin: right; transform: rotateY(40deg);";
    outerAnchor.appendChild(innerAnchor);
    window.document.documentElement.appendChild(outerAnchor);
    tmp = innerAnchor.getBoundingClientRect();
    window.document.documentElement.removeChild(outerAnchor);
    result = tmp.width && tmp.width < 4;
    return result;
}
exports["default"] = {
    hasPreserve3d: hasPreserve3d
};
//# sourceMappingURL=index.js.map