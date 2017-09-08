let internal1 = require("../internal")
exports.easeInExpo = function(x) {
  return x === 0 ? 0 : internal1.pow(2, 10 * x - 10)
}
