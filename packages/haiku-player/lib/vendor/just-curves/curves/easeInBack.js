var internal1 = require("../internal");
exports.easeInBack = function (x) {
    return internal1.c3 * x * x * x - internal1.c1 * x * x;
};
