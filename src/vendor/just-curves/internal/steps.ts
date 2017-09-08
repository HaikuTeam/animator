exports.steps = function(count, pos) {
  let q = count / 1
  let p = pos === "end" ? 0 : pos === "start" ? 1 : pos || 0
  return function(x) {
    return x >= 1 ? 1 : p * q + x - (p * q + x) % q
  }
}
