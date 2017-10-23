"use strict";
exports.__esModule = true;
var objectPath_1 = require("./objectPath");
var HAIKU_ID_ATTRIBUTE = 'haiku-id';
function matchByHaiku(node, haikuString, options) {
    var attributes = objectPath_1["default"](node, options.attributes);
    if (!attributes) {
        return false;
    }
    if (!attributes[HAIKU_ID_ATTRIBUTE]) {
        return false;
    }
    return attributes[HAIKU_ID_ATTRIBUTE] === haikuString;
}
exports["default"] = matchByHaiku;
//# sourceMappingURL=cssMatchByHaiku.js.map