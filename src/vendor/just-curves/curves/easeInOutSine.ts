let internal1 = require("../internal")
exports.easeInOutSine = function(x) {
  return -(internal1.cos(internal1.pi * x) - 1) / 2
}
