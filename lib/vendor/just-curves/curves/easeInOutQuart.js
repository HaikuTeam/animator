var internal1 = require("../internal");
exports.easeInOutQuart = function (x) {
    return x < 0.5 ? 8 * x * x * x * x : 1 - internal1.pow(-2 * x + 2, 4) / 2;
};
