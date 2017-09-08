var index1 = require("./index");
exports.easeInBounce = function (x) {
    return 1 - index1.easeOutBounce(1 - x);
};
