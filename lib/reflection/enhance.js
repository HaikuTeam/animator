"use strict";
exports.__esModule = true;
var functionToRFO_1 = require("./functionToRFO");
function enhance(fn, params) {
    if (!fn.specification) {
        var rfo = functionToRFO_1["default"](fn);
        if (rfo && rfo.__function) {
            fn.specification = rfo.__function;
            if (params) {
                fn.specification.params = params;
            }
        }
        else {
            fn.specification = true;
        }
    }
}
exports["default"] = enhance;
//# sourceMappingURL=enhance.js.map