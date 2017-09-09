"use strict";
exports.__esModule = true;
var cssPrefix_1 = require("./cssPrefix");
var hyphenate_1 = require("./stringUtils/hyphenate");
var camelize_1 = require("./stringUtils/camelize");
var hasOwn_1 = require("./hasOwn");
var isObject_1 = require("./isObject");
var isFunction_1 = require("./isFunction");
function applyPrefix(target, property, value, normalizeFn) {
    cssPrefix_1["default"](property, null).forEach(function (p) {
        target[normalizeFn ? normalizeFn(p) : p] = value;
    });
}
function toObject(str) {
    str = (str || "").split(";");
    var result = {};
    str.forEach(function (item) {
        var split = item.split(":");
        if (split.length === 2) {
            result[split[0].trim()] = split[1].trim();
        }
    });
    return result;
}
var CONFIG = {
    cssUnitless: require("./cssUnitless")
};
function _notUndef(thing) {
    return thing !== null && thing !== undefined;
}
function toStyleObject(styles, config, prepend, result) {
    if (typeof styles === "string") {
        styles = toObject(styles);
    }
    config = config || CONFIG;
    config.cssUnitless = config.cssUnitless || CONFIG.cssUnitless;
    result = result || {};
    var scope = config.scope || {};
    var addUnits = _notUndef(config.addUnits)
        ? config.addUnits
        : scope && _notUndef(scope.addUnits) ? scope.addUnits : true;
    var cssUnitless = (_notUndef(config.cssUnitless)
        ? config.cssUnitless
        : scope ? scope.cssUnitless : null) || {};
    var cssUnit = (config.cssUnit || scope ? scope.cssUnit : null) || "px";
    var prefixProperties = config.prefixProperties || (scope ? scope.prefixProperties : null) || {};
    var camelize = config.camelize;
    var normalizeFn = camelize ? camelize_1["default"] : hyphenate_1["default"];
    var processed, styleName, propName, propValue, propType, propIsNumber, fnPropValue, prefix;
    for (propName in styles) {
        if (hasOwn_1["default"](styles, propName)) {
            propValue = styles[propName];
            styleName = hyphenate_1["default"](prepend ? prepend + propName : propName);
            processed = false;
            prefix = false;
            if (isFunction_1["default"](propValue)) {
                fnPropValue = propValue.call(scope || styles, propValue, propName, styleName, styles);
                if (isObject_1["default"](fnPropValue) && fnPropValue.value != null) {
                    propValue = fnPropValue.value;
                    prefix = fnPropValue.prefix;
                    styleName = fnPropValue.name ? hyphenate_1["default"](fnPropValue.name) : styleName;
                }
                else {
                    propValue = fnPropValue;
                }
            }
            propType = typeof propValue;
            propIsNumber =
                propType === "number" ||
                    (propType === "string" &&
                        propValue !== "" &&
                        propValue * 1 === propValue);
            if (propValue === null ||
                propValue === undefined ||
                styleName === null ||
                styleName === undefined ||
                styleName === "") {
                continue;
            }
            if (propIsNumber || propType === "string") {
                processed = true;
            }
            if (!processed && _notUndef(propValue.value) && propValue.prefix) {
                processed = true;
                prefix = propValue.prefix;
                propValue = propValue.value;
            }
            if (processed) {
                prefix = prefix || !!prefixProperties[styleName];
                if (propIsNumber) {
                    propValue = addUnits && !(styleName in cssUnitless)
                        ? propValue + cssUnit
                        : propValue + "";
                }
                if ((styleName === "border" ||
                    (!styleName.indexOf("border") &&
                        !~styleName.indexOf("radius") &&
                        !~styleName.indexOf("width"))) &&
                    propIsNumber) {
                    styleName = styleName + "-width";
                }
                if (!styleName.indexOf("border-radius-")) {
                    styleName.replace(/border(-radius)(-(.*))/, function (str, radius, theRest) {
                        var positions = {
                            "-top": ["-top-left", "-top-right"],
                            "-left": ["-top-left", "-bottom-left"],
                            "-right": ["-top-right", "-bottom-right"],
                            "-bottom": ["-bottom-left", "-bottom-right"]
                        };
                        if (theRest in positions) {
                            styleName = [];
                            positions[theRest].forEach(function (pos) {
                                styleName.push("border" + pos + radius);
                            });
                        }
                        else {
                            styleName = "border" + theRest + radius;
                        }
                    });
                    if (Array.isArray(styleName)) {
                        styleName.forEach(function (styleName) {
                            if (prefix) {
                                applyPrefix(result, styleName, propValue, normalizeFn);
                            }
                            else {
                                result[normalizeFn(styleName)] = propValue;
                            }
                        });
                        continue;
                    }
                }
                if (prefix) {
                    applyPrefix(result, styleName, propValue, normalizeFn);
                }
                else {
                    result[normalizeFn(styleName)] = propValue;
                }
            }
            else {
                toStyleObject(propValue, config, styleName + "-", result);
            }
        }
    }
    return result;
}
exports["default"] = toStyleObject;
//# sourceMappingURL=toStyleObject.js.map