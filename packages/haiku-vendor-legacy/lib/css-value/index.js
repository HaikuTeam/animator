"use strict";
/**
 * The MIT License
 *
 * Copyright (c) 2012 TJ Holowaychuk <tj@vision-media.ca>
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
function Parser(str) {
    this.str = str;
}
Parser.prototype.skip = function (m) {
    this.str = this.str.slice(m[0].length);
};
Parser.prototype.comma = function () {
    var m = /^, */.exec(this.str);
    if (!m) {
        return;
    }
    this.skip(m);
    return {
        type: 'comma',
        string: ',',
    };
};
Parser.prototype.ident = function () {
    var m = /^([\w-]+) */.exec(this.str);
    if (!m) {
        return;
    }
    this.skip(m);
    return {
        type: 'ident',
        string: m[1],
    };
};
Parser.prototype.int = function () {
    var m = /^((\d+)(\S+)?) */.exec(this.str);
    if (!m) {
        return;
    }
    this.skip(m);
    var n = ~~m[2];
    var u = m[3];
    return {
        type: 'number',
        string: m[1],
        unit: u || '',
        value: n,
    };
};
Parser.prototype.float = function () {
    var m = /^(((?:\d+)?\.\d+)(\S+)?) */.exec(this.str);
    if (!m) {
        return;
    }
    this.skip(m);
    var n = parseFloat(m[2]);
    var u = m[3];
    return {
        type: 'number',
        string: m[1],
        unit: u || '',
        value: n,
    };
};
Parser.prototype.number = function () {
    return this.float() || this.int();
};
Parser.prototype.double = function () {
    var m = /^"([^"]*)" */.exec(this.str);
    if (!m) {
        return m;
    }
    this.skip(m);
    return {
        type: 'string',
        quote: '"',
        string: '"' + m[1] + '"',
        value: m[1],
    };
};
Parser.prototype.single = function () {
    var m = /^'([^']*)' */.exec(this.str);
    if (!m) {
        return m;
    }
    this.skip(m);
    return {
        type: 'string',
        quote: '\'',
        string: '\'' + m[1] + '\'',
        value: m[1],
    };
};
Parser.prototype.string = function () {
    return this.single() || this.double();
};
Parser.prototype.value = function () {
    return this.number() || this.ident() || this.string() || this.comma();
};
Parser.prototype.parse = function () {
    var vals = [];
    while (this.str.length) {
        var obj = this.value();
        if (!obj) {
            throw new Error('failed to parse near `' + this.str.slice(0, 10) + '...`');
        }
        vals.push(obj);
    }
    return vals;
};
function parse(str) {
    return new Parser(str).parse();
}
exports.default = parse;
//# sourceMappingURL=index.js.map