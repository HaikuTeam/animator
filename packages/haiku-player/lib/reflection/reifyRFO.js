"use strict";
exports.__esModule = true;
var inject_1 = require("./inject");
var functionSpecificationToFunction_1 = require("./functionSpecificationToFunction");
function reifyRFO(rfo) {
    var fn = functionSpecificationToFunction_1["default"](rfo.name || "", rfo.params, rfo.body, rfo.type);
    if (rfo.injectee) {
        inject_1["default"].apply(null, [fn].concat(rfo.params));
    }
    return fn;
}
exports["default"] = reifyRFO;
//# sourceMappingURL=reifyRFO.js.map