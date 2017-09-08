var toCamelFn = function (str, letter) {
  return letter ? letter.toUpperCase() : ''
}

var hyphenRe = require('./hyphenRe')

module.exports = function (str) {
  return str ? str.replace(hyphenRe, toCamelFn) : ''
}
