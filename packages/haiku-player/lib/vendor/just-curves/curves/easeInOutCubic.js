var internal1 = require('../internal')
exports.easeInOutCubic = function (x) {
  return x < 0.5 ? 4 * x * x * x : 1 - internal1.pow(-2 * x + 2, 3) / 2
}
