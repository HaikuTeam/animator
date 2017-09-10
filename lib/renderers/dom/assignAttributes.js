"use strict";
exports.__esModule = true;
var assignClass_1 = require("./assignClass");
var assignEvent_1 = require("./assignEvent");
var assignStyle_1 = require("./assignStyle");
var getFlexId_1 = require("./getFlexId");
var STYLE = "style";
var OBJECT = "object";
var FUNCTION = "function";
var CLASS = "class";
var CLASS_NAME = "className";
var XLINK_XMLNS = "http://www.w3.org/1999/xlink";
var X = "x";
var L = "l";
var I = "i";
var N = "n";
var K = "k";
var D = "d";
var A = "a";
var T = "t";
var COLON = ":";
var M = "m";
var G = "g";
var E = "e";
var FSLASH = "/";
function setAttribute(el, key, val, component, cache) {
    if (key[0] === X && key[1] === L && key[2] === I && key[3] === N && key[4] === K) {
        var ns = XLINK_XMLNS;
        if (val[0] === D &&
            val[1] === A &&
            val[2] === T &&
            val[3] === A &&
            val[4] === COLON &&
            val[5] === I &&
            val[6] === M &&
            val[7] === A &&
            val[8] === G &&
            val[9] === E &&
            val[10] === FSLASH) {
            if (!cache.base64image) {
                el.setAttributeNS(ns, key, val);
                cache.base64image = true;
            }
        }
        else {
            var p0 = el.getAttributeNS(ns, key);
            if (p0 !== val) {
                el.setAttributeNS(ns, key, val);
            }
        }
    }
    else {
        if (key === "d") {
            if (val !== cache.d) {
                el.setAttribute(key, val);
                cache.d = val;
            }
        }
        else if (key === "points") {
            if (val !== cache.points) {
                el.setAttribute(key, val);
                cache.points = val;
            }
        }
        else {
            var p1 = el.getAttribute(key);
            if (p1 !== val) {
                el.setAttribute(key, val);
            }
        }
    }
}
function assignAttributes(domElement, virtualElement, component, isPatchOperation, isKeyDifferent) {
    if (!isPatchOperation) {
        if (domElement.haiku && domElement.haiku.element) {
            for (var oldKey in domElement.haiku.element.attributes) {
                var oldValue = domElement.haiku.element.attributes[oldKey];
                var newValue = virtualElement.attributes[oldKey];
                if (oldKey !== STYLE) {
                    if (newValue === null ||
                        newValue === undefined ||
                        oldValue !== newValue) {
                        domElement.removeAttribute(oldKey);
                    }
                }
            }
        }
    }
    for (var key in virtualElement.attributes) {
        var anotherNewValue = virtualElement.attributes[key];
        if (key === STYLE && anotherNewValue && typeof anotherNewValue === OBJECT) {
            assignStyle_1["default"](domElement, virtualElement, anotherNewValue, component, isPatchOperation);
            continue;
        }
        if ((key === CLASS || key === CLASS_NAME) && anotherNewValue) {
            assignClass_1["default"](domElement, anotherNewValue);
            continue;
        }
        if (key[0] === "o" &&
            key[1] === "n" &&
            typeof anotherNewValue === FUNCTION) {
            assignEvent_1["default"](domElement, key.slice(2).toLowerCase(), anotherNewValue, component);
            continue;
        }
        setAttribute(domElement, key, anotherNewValue, component, component.config.options.cache[getFlexId_1["default"](virtualElement)]);
    }
    if (virtualElement.__handlers) {
        for (var eventName in virtualElement.__handlers) {
            var handler = virtualElement.__handlers[eventName];
            if (!handler.__subscribed) {
                assignEvent_1["default"](domElement, eventName, handler, component);
                handler.__subscribed = true;
            }
        }
    }
    return domElement;
}
exports["default"] = assignAttributes;
//# sourceMappingURL=assignAttributes.js.map