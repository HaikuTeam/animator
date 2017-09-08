var index1 = require('./index')
var bezier = function (n1, n2, t) {
  return 3 * n1 * (1 - t) * (1 - t) * t + 3 * n2 * (1 - t) * t * t + t * t * t
}
exports.cubicBezier = function (p0, p1, p2, p3) {
  if (p0 < 0 || p0 > 1 || p2 < 0 || p2 > 1) {
    return function (x) {
      return x
    }
  }
  return function (x) {
    if (x === 0 || x === 1) {
      return x
    }
    var start = 0
    var end = 1
    var limit = 19
    do {
      var mid = (start + end) * 0.5
      var xEst = bezier(p0, p2, mid)
      if (index1.abs(x - xEst) < index1.epsilon) {
        return bezier(p1, p3, mid)
      }
      if (xEst < x) {
        start = mid
      } else {
        end = mid
      }
    } while (--limit)
    // limit is reached
    return x
  }
}
