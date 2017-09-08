var internal1 = require("../internal");
exports.easeInElastic = function (n) {
    return !n || n === 1
        ? n
        : -1 *
            internal1.sin((n - 1.1) * internal1.tau * 2.5) *
            internal1.pow(2, 10 * (n - 1));
};
