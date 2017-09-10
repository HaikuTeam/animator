"use strict";
exports.__esModule = true;
var internal_1 = require("../internal");
exports.easeInOutBack = function (x) { return x < 0.5
    ? (internal_1.pow(2 * x, 2) * ((internal_1.c2 + 1) * 2 * x - internal_1.c2)) / 2
    : (internal_1.pow(2 * x - 2, 2) * ((internal_1.c2 + 1) * (x * 2 - 2) + internal_1.c2) + 2) / 2; };
//# sourceMappingURL=easeInOutBack.js.map