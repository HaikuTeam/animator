let internal1 = require("../internal")
exports.easeOutSine = function(x) {
  return internal1.sin(x * internal1.pi / 2)
}
