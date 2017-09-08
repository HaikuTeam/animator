var nodehook = require('node-hook')
var transformCode = require('./../babel/transformCode')

var TRANSFORM_EXCLUDES = /(node_modules|bower_components|jspm_packages)/

function enhook (fn) {
  return nodehook.hook('.js', fn)
}

function dehook () {
  return nodehook.unhook('.js')
}

function startTransforming (options) {
  enhook(function _babelTransform (source, filename) {
    if (TRANSFORM_EXCLUDES.test(filename)) return source
    var transformed = transformCode(source, options || {})
    return transformed
  })
}

function stopTransforming () {
  dehook()
}

module.exports = {
  stopTransforming: stopTransforming,
  startTransforming: startTransforming
}
