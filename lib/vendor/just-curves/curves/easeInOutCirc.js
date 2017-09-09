"use strict";
exports.__esModule = true;
var internal_1 = require("../internal");
exports.easeInOutCirc = function (x) { return x < 0.5
    ? (1 - internal_1.sqrt(1 - internal_1.pow(2 * x, 2))) / 2
    : (internal_1.sqrt(1 - internal_1.pow(-2 * x + 2, 2)) + 1) / 2; };
//# sourceMappingURL=easeInOutCirc.js.map