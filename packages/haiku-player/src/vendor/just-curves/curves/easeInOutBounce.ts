let index1 = require("./index")
exports.easeInOutBounce = function(x) {
  return x < 0.5
    ? (1 - index1.easeOutBounce(1 - 2 * x)) / 2
    : (1 + index1.easeOutBounce(2 * x - 1)) / 2
}
