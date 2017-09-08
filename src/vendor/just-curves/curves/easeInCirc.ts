var internal1 = require('../internal')
exports.easeInCirc = function (x) {
  return 1 - internal1.sqrt(1 - x * x)
}
