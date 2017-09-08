var internal1 = require("../internal");
exports.easeOutCirc = function (x) {
    return internal1.sqrt(1 - (x - 1) * (x - 1));
};
