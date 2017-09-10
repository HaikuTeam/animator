"use strict";
exports.__esModule = true;
var internal_1 = require("../internal");
exports.easeInOutElastic = function (n) {
    if (!n || n === 1)
        return n;
    n *= 2;
    if (n < 1) {
        return -0.5 * (internal_1.pow(2, 10 * (n - 1)) * internal_1.sin((n - 1.1) * internal_1.tau / .4));
    }
    return internal_1.pow(2, -10 * (n - 1)) * internal_1.sin((n - 1.1) * internal_1.tau / .4) * .5 + 1;
};
//# sourceMappingURL=easeInOutElastic.js.map