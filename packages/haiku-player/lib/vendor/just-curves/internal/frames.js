var internal1 = require('../internal')
exports.frames = function (n) {
  var q = 1 / (n - 1)
  return function (x) {
    var o = internal1.floor(x * n) * q
    return x >= 0 && o < 0 ? 0 : x <= 1 && o > 1 ? 1 : o
  }
}
