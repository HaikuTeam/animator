let internal1 = require("../internal")
exports.easeInOutBack = function(x) {
  return x < 0.5
    ? internal1.pow(2 * x, 2) * ((internal1.c2 + 1) * 2 * x - internal1.c2) / 2
    : (internal1.pow(2 * x - 2, 2) *
        ((internal1.c2 + 1) * (x * 2 - 2) + internal1.c2) +
        2) /
        2
}
