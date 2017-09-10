"use strict";
exports.__esModule = true;
var internal_1 = require("../internal");
exports.easeInOutExpo = function (x) { return x === 0
    ? 0 : x === 1
    ? 1 : x < 0.5
    ? internal_1.pow(2, 20 * x - 10) / 2
    : (2 - internal_1.pow(2, -20 * x + 10)) / 2; };
//# sourceMappingURL=easeInOutExpo.js.map