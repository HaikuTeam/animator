"use strict";
exports.__esModule = true;
var to_style_1 = require("./../vendor/to-style");
var xml_parser_1 = require("./../vendor/xml-parser");
var styleStringToObject = to_style_1["default"].object;
function fixChildren(kids) {
    if (Array.isArray(kids)) {
        return kids.map(fixNode);
    }
    return fixNode(kids);
}
function fixAttributes(attributes) {
    if (attributes.style) {
        if (typeof attributes.style === 'string') {
            attributes.style = styleStringToObject(attributes.style, null, null, null);
        }
    }
    return attributes;
}
function fixNode(obj) {
    if (!obj) {
        return obj;
    }
    if (typeof obj === 'string') {
        return obj;
    }
    var children = obj.children;
    if (obj.content) {
        children = [obj.content];
    }
    return {
        elementName: obj.name,
        attributes: fixAttributes(obj.attributes || {}),
        children: fixChildren(children)
    };
}
function xmlToMana(xml) {
    var obj = xml_parser_1["default"](xml).root;
    return fixNode(obj);
}
exports["default"] = xmlToMana;
//# sourceMappingURL=xmlToMana.js.map