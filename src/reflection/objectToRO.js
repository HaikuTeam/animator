function objectToRO (obj, options) {
  var out = {}
  for (var key in obj) {
    if (options && options.ignore && options.ignore.test(key)) continue
    out[key] = expressionToRO(obj[key], options)
  }
  return out
}

module.exports = objectToRO

var expressionToRO = require('./expressionToRO')
