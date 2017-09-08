let internal1 = require("../internal")
exports.easeOutBack = function(x) {
  return (
    1 +
    internal1.c3 * internal1.pow(x - 1, 3) +
    internal1.c1 * internal1.pow(x - 1, 2)
  )
}
