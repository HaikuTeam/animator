"use strict";
exports.__esModule = true;
var index_1 = require("./index");
exports.easeInOutBounce = function (x) { return x < 0.5
    ? (1 - index_1.easeOutBounce(1 - 2 * x)) / 2
    : (1 + index_1.easeOutBounce(2 * x - 1)) / 2; };
//# sourceMappingURL=easeInOutBounce.js.map