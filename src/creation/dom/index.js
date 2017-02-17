var wrapper = require('./../../wrapper')
var renderer = require('./../../renderers/dom')

function creation (bytecode, _window) {
  return wrapper(renderer, bytecode, _window || window)
}

creation.registry = wrapper.registry

module.exports = creation
