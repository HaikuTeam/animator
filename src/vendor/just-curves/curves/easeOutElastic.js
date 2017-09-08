var internal1 = require('../internal')
exports.easeOutElastic = function (n) {
  if (!n || n === 1) return n
  var s
  var a = 0.1
  var p = 0.4
  if (!a || a < 1) {
    a = 1
    s = p / 4
  } else s = p * Math.asin(1 / a) / internal1.tau
  return (
    a * internal1.pow(2, -10 * n) * internal1.sin((n - s) * internal1.tau / p) +
    1
  )
}
