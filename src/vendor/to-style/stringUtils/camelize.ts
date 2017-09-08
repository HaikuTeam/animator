let toCamelFn = function(str, letter) {
  return letter ? letter.toUpperCase() : ""
}

let hyphenRe = require("./hyphenRe")

module.exports = function(str) {
  return str ? str.replace(hyphenRe, toCamelFn) : ""
}
