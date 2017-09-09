"use strict";
exports.__esModule = true;
var Events_1 = require("./Events");
function attachEventListener(domElement, eventName, listener, component) {
    if (typeof listener === "function") {
        if (Events_1["default"].window[eventName]) {
            var win = domElement.ownerDocument.defaultView || domElement.ownerDocument.parentWindow;
            if (win) {
                win.addEventListener(eventName, listener);
            }
        }
        else {
            domElement.addEventListener(eventName, listener);
        }
    }
}
exports["default"] = attachEventListener;
//# sourceMappingURL=attachEventListener.js.map