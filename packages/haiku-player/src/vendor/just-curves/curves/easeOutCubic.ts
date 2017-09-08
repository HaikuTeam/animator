var internal1 = require('../internal')
exports.easeOutCubic = function (x) {
  return 1 - internal1.pow(1 - x, 3)
}
