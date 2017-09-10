"use strict";
exports.__esModule = true;
var internal_1 = require("../internal");
exports.easeOutExpo = function (x) { return x === 1 ? 1 : 1 - internal_1.pow(2, -10 * x); };
//# sourceMappingURL=easeOutExpo.js.map