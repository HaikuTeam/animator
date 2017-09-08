var internal1 = require("../internal");
exports.easeInOutQuad = function (x) {
    return x < 0.5 ? 2 * x * x : 1 - internal1.pow(-2 * x + 2, 2) / 2;
};
