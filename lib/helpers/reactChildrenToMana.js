"use strict";
exports.__esModule = true;
var reactToMana_1 = require("./reactToMana");
function reactChildrenToMana(children) {
    if (!children) {
        return null;
    }
    if (children.length < 1) {
        return null;
    }
    return children.map(function (child) {
        if (typeof child === 'string') {
            return child;
        }
        return reactToMana_1["default"](child);
    });
}
exports["default"] = reactChildrenToMana;
//# sourceMappingURL=reactChildrenToMana.js.map