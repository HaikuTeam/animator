var path = require('path')
var RequireHook = require('./RequireHook')
var interopExport = require('./interopExport')

function loadModule (abspath, config) {
  RequireHook.startTransforming(config.babel || {})

  var fn = require

  var exp = fn(path.normalize(abspath))
  RequireHook.stopTransforming()
  return interopExport(exp)
}

module.exports = loadModule
