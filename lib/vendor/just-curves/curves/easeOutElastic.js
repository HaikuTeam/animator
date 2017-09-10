"use strict";
exports.__esModule = true;
var internal_1 = require("../internal");
exports.easeOutElastic = function (n) {
    if (!n || n === 1)
        return n;
    var s, a = 0.1, p = 0.4;
    if (!a || a < 1) {
        a = 1;
        s = p / 4;
    }
    else
        s = p * Math.asin(1 / a) / internal_1.tau;
    return (a * internal_1.pow(2, -10 * n) * internal_1.sin((n - s) * (internal_1.tau) / p) + 1);
};
//# sourceMappingURL=easeOutElastic.js.map