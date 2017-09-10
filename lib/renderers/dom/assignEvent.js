"use strict";
exports.__esModule = true;
var attachEventListener_1 = require("./attachEventListener");
function assignEvent(domElement, eventName, listenerFunction, component) {
    if (!domElement.haiku) {
        domElement.haiku = {};
    }
    if (!domElement.haiku.listeners) {
        domElement.haiku.listeners = {};
    }
    if (!domElement.haiku.listeners[eventName]) {
        domElement.haiku.listeners[eventName] = [];
    }
    var already = false;
    for (var i = 0; i < domElement.haiku.listeners[eventName].length; i++) {
        var existing = domElement.haiku.listeners[eventName][i];
        if (existing._haikuListenerId === listenerFunction._haikuListenerId) {
            already = true;
            break;
        }
    }
    if (!already) {
        listenerFunction._haikuListenerId = Math.random() + "";
        domElement.haiku.listeners[eventName].push(listenerFunction);
        attachEventListener_1["default"](domElement, eventName, listenerFunction, component);
    }
}
exports["default"] = assignEvent;
//# sourceMappingURL=assignEvent.js.map