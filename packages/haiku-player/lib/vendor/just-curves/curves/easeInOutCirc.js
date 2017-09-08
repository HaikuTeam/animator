var internal1 = require('../internal')
exports.easeInOutCirc = function (x) {
  return x < 0.5
    ? (1 - internal1.sqrt(1 - internal1.pow(2 * x, 2))) / 2
    : (internal1.sqrt(1 - internal1.pow(-2 * x + 2, 2)) + 1) / 2
}
