var wrapper = require('./../../wrapper')
var renderer = require('./../../renderers/dom')

module.exports = function creation (bytecode, _window) {
  return wrapper(renderer, bytecode, _window || window)
}
