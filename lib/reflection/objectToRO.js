"use strict";
exports.__esModule = true;
var expressionToRO_1 = require("./expressionToRO");
function objectToRO(obj, options) {
    var out = {};
    for (var key in obj) {
        if (options && options.ignore && options.ignore.test(key)) {
            continue;
        }
        out[key] = expressionToRO_1["default"](obj[key], options);
    }
    return out;
}
exports["default"] = objectToRO;
//# sourceMappingURL=objectToRO.js.map