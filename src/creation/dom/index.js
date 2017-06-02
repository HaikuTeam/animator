var wrapper = require('./../../wrapper')
var renderer = require('./../../renderers/dom')

function creation (bytecode, options, _window) {
  if (!options) options = {}

  if (!_window) {
    if (typeof window !== 'undefined') {
      _window = window
    }
  }

  if (options.useWebkitPrefix === undefined) {
    // Allow headless mode, e.g. in server-side rendering or Node.js unit tests
    if (_window && _window.document) {
      var isWebKit = 'WebkitAppearance' in _window.document.documentElement.style
      options.useWebkitPrefix = !!isWebKit
    }
  }

  return wrapper(renderer, bytecode, options, _window)
}

module.exports = creation
