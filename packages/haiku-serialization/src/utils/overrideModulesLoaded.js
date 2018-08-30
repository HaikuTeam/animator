const nodehook = require('node-hook')
const path = require('path')
const remapSource = require('../ast/remapSource')

function overrideModulesLoaded (cb, remapParams, iterator) {
  nodehook.hook('.js', function (source, filename) {
    if (path.basename(filename) !== 'code.js') {
      return source
    }
    var updated = remapSource(source, remapParams)
    if (iterator) iterator(filename, updated, source)
    return updated
  })

  return cb(function () { // eslint-disable-line
    return nodehook.unhook('.js')
  })
}

module.exports = overrideModulesLoaded
