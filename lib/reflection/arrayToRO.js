"use strict";
exports.__esModule = true;
var expressionToRO_1 = require("./expressionToRO");
function arrayToRO(arr) {
    var out = [];
    for (var i = 0; i < arr.length; i++) {
        out[i] = expressionToRO_1["default"](arr[i], null);
    }
    return out;
}
exports["default"] = arrayToRO;
//# sourceMappingURL=arrayToRO.js.map