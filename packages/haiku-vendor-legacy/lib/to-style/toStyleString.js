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
var toStyleObject_1 = require("./toStyleObject");
var hasOwn_1 = require("./hasOwn");
/**
 * @ignore
 * @method toStyleString
 * @param  {Object} styles The object to convert to a style string.
 * @param  {Object} config
 * @param  {Boolean} config.addUnits=true True if you want to add units when numerical values are encountered. Defaults
 *   to true
 * @param  {Object}  config.cssUnitless An object whose keys represent css numerical property names that will not be
 *   appended with units.
 * @param  {Object}  config.prefixProperties An object whose keys represent css property names that should be prefixed
 * @param  {String}  config.cssUnit='px' The css unit to append to numerical values. Defaults to 'px'
 * @param  {String}  config.scope
 * @return {Object} The object, normalized with css style names
 */
function toStyleString(styles, config) {
    styles = toStyleObject_1.default(styles, config, null, null);
    var result = [];
    var prop;
    for (prop in styles) {
        if (hasOwn_1.default(styles, prop)) {
            result.push(prop + ': ' + styles[prop]);
        }
    }
    return result.join('; ');
}
exports.default = toStyleString;
//# sourceMappingURL=toStyleString.js.map