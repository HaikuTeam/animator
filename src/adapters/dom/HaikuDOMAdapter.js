var HaikuContext = require('./../../HaikuContext')
var HaikuDOMRenderer = require('./../../renderers/dom')
var PLAYER_VERSION = require('./../../../package.json').version

/**
 * Example ways this gets invoked:
 *
 * // via embed snippet
 * window.HaikuPlayer['2.0.125'](require('./bytecode.js'))
 *
 * // via module require
 * var HaikuCreation = require('@haiku/player/dom')
 * module.exports = HaikuCreation(require('./bytecode.js'))
 */

var IS_WINDOW_DEFINED = typeof window !== 'undefined'

/**
 * @function HaikuDOMAdapter
 * @description Given a bytecode object, return a factory function which can create a DOM-playable component.
 */
function HaikuDOMAdapter (bytecode, options, _window) {
  if (!options) options = {}

  if (!_window) {
    if (IS_WINDOW_DEFINED) {
      _window = window
    }
  }

  if (options.useWebkitPrefix === undefined) {
    // Allow headless mode, e.g. in server-side rendering or in Node.js unit tests
    if (_window && _window.document) {
      var isWebKit = 'WebkitAppearance' in _window.document.documentElement.style
      options.useWebkitPrefix = !!isWebKit
    }
  }

  return HaikuContext.createComponentFactory(HaikuDOMRenderer, bytecode, options, _window)
}

// Allow multiple players of different versions to exist on the same page
if (IS_WINDOW_DEFINED) {
  if (!window.HaikuPlayer) {
    window.HaikuPlayer = {}
  }

  window.HaikuPlayer[PLAYER_VERSION] = HaikuDOMAdapter
}

module.exports = HaikuDOMAdapter
