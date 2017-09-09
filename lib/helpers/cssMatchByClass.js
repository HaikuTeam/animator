"use strict";
exports.__esModule = true;
var objectPath_1 = require("./objectPath");
var CLASS_NAME_ATTR = "class";
var ALT_CLASS_NAME_ATTR = "className";
var SPACE = " ";
function matchByClass(node, className, options) {
    var attributes = objectPath_1["default"](node, options.attributes);
    if (attributes) {
        var foundClassName = attributes[CLASS_NAME_ATTR];
        if (!foundClassName)
            foundClassName = attributes[ALT_CLASS_NAME_ATTR];
        if (foundClassName) {
            var classPieces = foundClassName.split(SPACE);
            if (classPieces.indexOf(className) !== -1) {
                return true;
            }
        }
    }
}
exports["default"] = matchByClass;
//# sourceMappingURL=cssMatchByClass.js.map