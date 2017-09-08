function interopExport (exp) {
  if (exp && exp.__esModule) return exp
  var fixed = {}
  if (exp !== null && exp !== undefined) {
    for (var key in exp) {
      if (Object.prototype.hasOwnProperty.call(exp, key)) {
        fixed[key] = exp[key]
      }
    }
  }
  fixed.default = exp
  return fixed
}

module.exports = interopExport
