var internal1 = require('../internal')
exports.easeInOutExpo = function (x) {
  return x === 0
    ? 0
    : x === 1
      ? 1
      : x < 0.5
        ? internal1.pow(2, 20 * x - 10) / 2
        : (2 - internal1.pow(2, -20 * x + 10)) / 2
}
