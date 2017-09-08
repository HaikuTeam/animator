let internal1 = require("../internal")
exports.easeOutQuart = function(x) {
  return 1 - internal1.pow(1 - x, 4)
}
