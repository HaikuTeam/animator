var Events = require("./Events");
module.exports = function attachEventListener(domElement, eventName, listener, component) {
    if (typeof listener === "function") {
        if (Events.window[eventName]) {
            var win_1 = domElement.ownerDocument.defaultView || domElement.ownerDocument.parentWindow;
            if (win_1) {
                win_1.addEventListener(eventName, listener);
            }
        }
        else {
            domElement.addEventListener(eventName, listener);
        }
    }
};
