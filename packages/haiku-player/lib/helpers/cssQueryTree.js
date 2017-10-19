"use strict";
exports.__esModule = true;
var BasicUtils_1 = require("./BasicUtils");
var cssQueryList_1 = require("./cssQueryList");
var manaFlattenTree_1 = require("./manaFlattenTree");
var OBJECT = 'object';
function queryTree(matches, node, query, options) {
    if (!node || typeof node !== OBJECT) {
        return matches;
    }
    var list = BasicUtils_1["default"].uniq(manaFlattenTree_1["default"]([], node, options, 0, 0));
    cssQueryList_1["default"](matches, list, query, options);
    return matches;
}
exports["default"] = queryTree;
//# sourceMappingURL=cssQueryTree.js.map