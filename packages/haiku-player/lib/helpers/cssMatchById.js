"use strict";
exports.__esModule = true;
var objectPath_1 = require("./objectPath");
function matchById(node, id, options) {
    var attributes = objectPath_1["default"](node, options.attributes);
    if (attributes) {
        if (attributes.id === id) {
            return true;
        }
    }
}
exports["default"] = matchById;
//# sourceMappingURL=cssMatchById.js.map