"use strict";
exports.__esModule = true;
var internal_1 = require("../internal");
exports.easeInElastic = function (n) {
    return !n || n === 1 ? n : -1 * internal_1.sin((n - 1.1) * internal_1.tau * 2.5) * internal_1.pow(2, 10 * (n - 1));
};
//# sourceMappingURL=easeInElastic.js.map