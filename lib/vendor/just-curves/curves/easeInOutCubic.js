"use strict";
exports.__esModule = true;
var internal_1 = require("../internal");
exports.easeInOutCubic = function (x) { return x < 0.5
    ? 4 * x * x * x
    : 1 - internal_1.pow(-2 * x + 2, 3) / 2; };
//# sourceMappingURL=easeInOutCubic.js.map