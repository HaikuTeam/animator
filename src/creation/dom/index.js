var wrapper = require('./../../wrapper')
var renderer = require('./../../renderers/dom')

module.exports = function creation (bytecode) {
  return wrapper(renderer, bytecode, window)
}
