var loadModule = require('./loadModule')
var invalidateModule = require('./invalidateModule')

function reloadModule (abspath, config) {
  invalidateModule(abspath)
  return loadModule(abspath, config)
}

module.exports = reloadModule
