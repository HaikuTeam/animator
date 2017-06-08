module.exports = function assign(t) {
  for (var s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i]
    for (var p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p)) {
        t[p] = s[p]
      }
    }
  }
  return t
}
