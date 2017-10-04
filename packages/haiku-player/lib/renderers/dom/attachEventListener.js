"use strict";
exports.__esModule = true;
var Events_1 = require("./Events");
function attachEventListener(virtualElement, domElement, eventName, listener, component) {
    if (typeof listener === "function") {
        var target = void 0;
        if (Events_1["default"].window[eventName]) {
            target = domElement.ownerDocument.defaultView || domElement.ownerDocument.parentWindow;
        }
        else {
            target = domElement;
        }
        if (target) {
            if (!component._hasRegisteredListenerOnElement(virtualElement, eventName, listener)) {
                component._markDidRegisterListenerOnElement(virtualElement, target, eventName, listener);
                target.addEventListener(eventName, listener);
            }
        }
    }
}
exports["default"] = attachEventListener;
//# sourceMappingURL=attachEventListener.js.map