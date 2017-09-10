"use strict";
exports.__esModule = true;
var internal_1 = require("../internal");
exports.easeInOutQuint = function (x) { return x < 0.5
    ? 16 * x * x * x * x * x
    : 1 - internal_1.pow(-2 * x + 2, 5) / 2; };
//# sourceMappingURL=easeInOutQuint.js.map