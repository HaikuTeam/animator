"use strict";
exports.__esModule = true;
var internal_1 = require("../internal");
exports.easeOutBack = function (x) { return 1 + internal_1.c3 * internal_1.pow(x - 1, 3) + internal_1.c1 * internal_1.pow(x - 1, 2); };
//# sourceMappingURL=easeOutBack.js.map