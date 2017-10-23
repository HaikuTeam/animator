"use strict";
exports.__esModule = true;
var objectPath_1 = require("./objectPath");
function flattenTree(list, node, options, depth, index) {
    if (depth === void 0) { depth = 0; }
    if (index === void 0) { index = 0; }
    list.push(node);
    if (typeof node !== 'string') {
        node.__depth = depth;
        node.__index = index;
    }
    var children = objectPath_1["default"](node, options.children);
    if (!children || children.length < 1 || typeof children === 'string') {
        return list;
    }
    if (Array.isArray(children)) {
        for (var i = 0; i < children.length; i++) {
            flattenTree(list, children[i], options, depth + 1, i);
        }
    }
    else if (typeof children === 'object') {
        children.__depth = depth + 1;
        children.__index = 0;
        list.push(children);
        return list;
    }
    return list;
}
exports["default"] = flattenTree;
//# sourceMappingURL=manaFlattenTree.js.map