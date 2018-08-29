"use strict";
/**
 * The MIT License
 *
 * Copyright (c) Segment
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
/**
 * Parse the given string of `xml`.
 *
 * @param {String} xml
 * @return {Object}
 * @api public
 */
function parse(xml) {
    xml = xml.trim();
    // strip comments
    xml = xml.replace(/<!--[\s\S]*?-->/g, '');
    // strip DOCTYPE declaration
    xml = xml.replace(/<!DOCTYPE[\s\S]*?>/i, '');
    return document();
    /**
     * XML document.
     */
    function document() {
        return {
            declaration: declaration(),
            root: tag(),
        };
    }
    /**
     * Declaration.
     */
    function declaration() {
        var m = match(/^<\?xml\s*/);
        if (!m) {
            return;
        }
        // tag
        var node = {
            attributes: {},
        };
        // attributes
        while (!(eos() || is('?>'))) {
            var attr = attribute();
            if (!attr) {
                return node;
            }
            node.attributes[attr.name] = attr.value;
        }
        match(/\?>\s*/);
        return node;
    }
    /**
     * Tag.
     */
    function tag() {
        var m = match(/^<([\w-:.]+)\s*/);
        if (!m) {
            return;
        }
        // name
        var node = {
            name: m[1],
            attributes: {},
            children: [],
            content: null,
        };
        // attributes
        while (!(eos() || is('>') || is('?>') || is('/>'))) {
            var attr = attribute();
            if (!attr) {
                return node;
            }
            // tslint:disable-next-line:triple-equals
            if (parseFloat(attr.value) == attr.value) {
                attr.value = parseFloat(attr.value);
            }
            node.attributes[attr.name] = attr.value;
        }
        // self closing tag
        if (match(/^\s*\/>\s*/)) {
            return node;
        }
        match(/\??>\s*/);
        // content
        node.content = content();
        // children
        var child = tag();
        while (child) {
            node.children.push(child);
            child = tag();
        }
        // closing
        match(/^<\/[\w-:.]+>\s*/);
        return node;
    }
    /**
     * Text content.
     */
    function content() {
        var m = match(/^([^<]*)/);
        if (m) {
            return m[1];
        }
        return '';
    }
    /**
     * Attribute.
     */
    function attribute() {
        var m = match(/([\w:-]+)\s*=\s*("[^"]*"|'[^']*'|\w+)\s*/);
        if (!m) {
            return;
        }
        return {
            name: m[1],
            value: strip(m[2]),
        };
    }
    /**
     * Strip quotes from `val`.
     */
    function strip(val) {
        return val.replace(/^['"]|['"]$/g, '');
    }
    /**
     * Match `re` and advance the string.
     */
    function match(re) {
        var m = xml.match(re);
        if (!m) {
            return;
        }
        xml = xml.slice(m[0].length);
        return m;
    }
    /**
     * End-of-source.
     */
    function eos() {
        return xml.length === 0;
    }
    /**
     * Check for `prefix`.
     */
    function is(prefix) {
        return xml.indexOf(prefix) === 0;
    }
}
exports.default = parse;
//# sourceMappingURL=index.js.map