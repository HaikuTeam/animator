var wrapper = require('./../../wrapper')
var renderer = require('./../../renderers/dom')

function creation (bytecode, options, _window) {
  return wrapper(renderer, bytecode, options, _window || window)
}

module.exports = creation
