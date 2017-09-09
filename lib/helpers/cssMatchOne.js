"use strict";
exports.__esModule = true;
var cssMatchById_1 = require("./cssMatchById");
var cssMatchByClass_1 = require("./cssMatchByClass");
var cssMatchByTagName_1 = require("./cssMatchByTagName");
var cssMatchByAttribute_1 = require("./cssMatchByAttribute");
var cssMatchByHaiku_1 = require("./cssMatchByHaiku");
var attrSelectorParser_1 = require("./attrSelectorParser");
var ID_PREFIX = "#";
var CLASS_PREFIX = ".";
var ATTR_PREFIX = "[";
var HAIKU_PREFIX = "haiku:";
function matchOne(node, piece, options) {
    if (piece.slice(0, 6) === HAIKU_PREFIX) {
        return cssMatchByHaiku_1["default"](node, piece.slice(6), options);
    }
    if (piece[0] === ID_PREFIX) {
        return cssMatchById_1["default"](node, piece.slice(1, piece.length), options);
    }
    if (piece[0] === CLASS_PREFIX) {
        return cssMatchByClass_1["default"](node, piece.slice(1, piece.length), options);
    }
    if (piece[0] === ATTR_PREFIX) {
        var parsedAttr = attrSelectorParser_1["default"](piece);
        if (!parsedAttr)
            return false;
        return cssMatchByAttribute_1["default"](node, parsedAttr.key, parsedAttr.operator, parsedAttr.value, options);
    }
    return cssMatchByTagName_1["default"](node, piece, options);
}
exports["default"] = matchOne;
//# sourceMappingURL=cssMatchOne.js.map