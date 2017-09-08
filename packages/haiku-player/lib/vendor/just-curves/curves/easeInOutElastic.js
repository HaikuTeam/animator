var internal1 = require('../internal')
exports.easeInOutElastic = function (n) {
  if (!n || n === 1) return n
  n *= 2
  if (n < 1) {
    return (
      -0.5 *
      (internal1.pow(2, 10 * (n - 1)) *
        internal1.sin((n - 1.1) * internal1.tau / 0.4))
    )
  }
  return (
    internal1.pow(2, -10 * (n - 1)) *
      internal1.sin((n - 1.1) * internal1.tau / 0.4) *
      0.5 +
    1
  )
}
