"use strict";
exports.__esModule = true;
var camelize_1 = require("./stringUtils/camelize");
var hyphenate_1 = require("./stringUtils/hyphenate");
var toLowerFirst_1 = require("./stringUtils/toLowerFirst");
var toUpperFirst_1 = require("./stringUtils/toUpperFirst");
var prefixInfo_1 = require("./prefixInfo");
var prefixProperties_1 = require("./prefixProperties");
var docStyle = typeof document === "undefined"
    ? {}
    : document.documentElement.style;
function prefixer(asStylePrefix) {
    return function (name, config) {
        config = config || {};
        var styleName = toLowerFirst_1["default"](camelize_1["default"](name));
        var cssName = hyphenate_1["default"](name);
        var theName = asStylePrefix ? styleName : cssName;
        var thePrefix = prefixInfo_1["default"].style
            ? asStylePrefix ? prefixInfo_1["default"].style : prefixInfo_1["default"].css
            : "";
        if (styleName in docStyle) {
            return config.asString ? theName : [theName];
        }
        var upperCased = theName;
        var prefixProperty = prefixProperties_1["default"][cssName];
        var result = [];
        if (asStylePrefix) {
            upperCased = toUpperFirst_1["default"](theName);
        }
        if (typeof prefixProperty === "function") {
            var prefixedCss = prefixProperty(theName, thePrefix) || [];
            if (prefixedCss && !Array.isArray(prefixedCss)) {
                prefixedCss = [prefixedCss];
            }
            if (prefixedCss.length) {
                prefixedCss = prefixedCss.map(function (property) {
                    return asStylePrefix
                        ? toLowerFirst_1["default"](camelize_1["default"](property))
                        : hyphenate_1["default"](property);
                });
            }
            result = result.concat(prefixedCss);
        }
        if (thePrefix) {
            result.push(thePrefix + upperCased);
        }
        result.push(theName);
        if (config.asString || result.length === 1) {
            return result[0];
        }
        return result;
    };
}
exports["default"] = prefixer;
//# sourceMappingURL=prefixer.js.map