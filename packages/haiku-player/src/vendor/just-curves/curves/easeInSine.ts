var internal1 = require('../internal')
exports.easeInSine = function (x) {
  return 1 - internal1.cos(x * internal1.pi / 2)
}
