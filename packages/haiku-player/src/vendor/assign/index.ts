module.exports = function assign(t) {
  for (let s, i = 1, n = arguments.length; i < n; i++) {
    s = arguments[i]
    for (let p in s) {
      if (Object.prototype.hasOwnProperty.call(s, p)) {
        t[p] = s[p]
      }
    }
  }
  return t
}
