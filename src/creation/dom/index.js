var wrapper = require('./../../wrapper')
var renderer = require('./../../renderers/dom')

function creation (bytecode, options, _window) {
  if (!options) options = {}
  var platform = _window || window

  if (options.useWebkitPrefix === undefined) {
    var isWebKit = 'WebkitAppearance' in platform.document.documentElement.style
    options.useWebkitPrefix = !!isWebKit
  }

  return wrapper(renderer, bytecode, options, platform)
}

module.exports = creation
