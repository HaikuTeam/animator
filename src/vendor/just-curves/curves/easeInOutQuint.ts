var internal1 = require('../internal')
exports.easeInOutQuint = function (x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - internal1.pow(-2 * x + 2, 5) / 2
}
