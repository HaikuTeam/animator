"use strict";
/**
 * The MIT License
 *
 * Copyright (c) Radu Brehar
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit
 * persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var camelize_1 = require("./stringUtils/camelize");
var hyphenate_1 = require("./stringUtils/hyphenate");
var toLowerFirst_1 = require("./stringUtils/toLowerFirst");
var toUpperFirst_1 = require("./stringUtils/toUpperFirst");
var prefixInfo_1 = require("./prefixInfo");
var prefixProperties_1 = require("./prefixProperties");
var docStyle = typeof document === 'undefined'
    ? {}
    : document.documentElement.style;
function prefixer(asStylePrefix) {
    return function (name, config) {
        config = config || {};
        var styleName = toLowerFirst_1.default(camelize_1.default(name));
        var cssName = hyphenate_1.default(name);
        var theName = asStylePrefix ? styleName : cssName;
        var thePrefix = prefixInfo_1.default.style
            ? asStylePrefix ? prefixInfo_1.default.style : prefixInfo_1.default.css
            : '';
        if (styleName in docStyle) {
            return config.asString ? theName : [theName];
        }
        // not a valid style name, so we'll return the value with a prefix
        var upperCased = theName;
        var prefixProperty = prefixProperties_1.default[cssName];
        var result = [];
        if (asStylePrefix) {
            upperCased = toUpperFirst_1.default(theName);
        }
        if (typeof prefixProperty === 'function') {
            var prefixedCss = prefixProperty(theName, thePrefix) || [];
            if (prefixedCss && !Array.isArray(prefixedCss)) {
                prefixedCss = [prefixedCss];
            }
            if (prefixedCss.length) {
                prefixedCss = prefixedCss.map(function (property) {
                    return asStylePrefix
                        ? toLowerFirst_1.default(camelize_1.default(property))
                        : hyphenate_1.default(property);
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
exports.default = prefixer;
//# sourceMappingURL=prefixer.js.map