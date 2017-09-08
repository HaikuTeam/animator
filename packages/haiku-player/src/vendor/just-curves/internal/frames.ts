let internal1 = require("../internal")
exports.frames = function(n) {
  let q = 1 / (n - 1)
  return function(x) {
    let o = internal1.floor(x * n) * q
    return x >= 0 && o < 0 ? 0 : x <= 1 && o > 1 ? 1 : o
  }
}
