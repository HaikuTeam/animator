var nodehook = require('node-hook')
var remapSource = require('./../ast/remapSource')

function overrideModulesLoaded (cb, remapParams, iterator) {
  nodehook.hook('.js', function (source, filename) {
    var updated = remapSource(source, remapParams)
    if (iterator) iterator(filename, updated, source)
    return updated
  })

  return cb(function () { // eslint-disable-line
    return nodehook.unhook('.js')
  })
}

module.exports = overrideModulesLoaded
