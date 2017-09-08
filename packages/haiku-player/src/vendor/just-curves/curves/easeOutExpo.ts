var internal1 = require('../internal')
exports.easeOutExpo = function (x) {
  return x === 1 ? 1 : 1 - internal1.pow(2, -10 * x)
}
