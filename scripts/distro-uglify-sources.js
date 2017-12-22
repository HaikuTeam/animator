var async = require('async')
var path = require('path')
var Uglify2 = require('uglify-js')
var glob = require('glob-all')
var log = require('./helpers/log')
var fse = require('fs-extra')

var ROOT = path.join(__dirname, '..')

// File globs with respect to the root of the mono project
var GLOBS = [
  'source/plumbing/lib/*.js',
  'source/plumbing/node_modules/haiku-bytecode/src/**/*.js',
  'source/plumbing/node_modules/@haiku/cli/lib/**/*.js',
  'source/plumbing/node_modules/haiku-common/lib/**/*.js',
  'source/plumbing/node_modules/haiku-creator-electron/lib/**/*.js',
  'source/plumbing/node_modules/haiku-formats/lib/**/*.js',
  'source/plumbing/node_modules/haiku-glass/lib/**/*.js',
  'source/plumbing/node_modules/@haiku/sdk-client/lib/**/*.js',
  'source/plumbing/node_modules/haiku-sdk-creator/lib/**/*.js',
  'source/plumbing/node_modules/@haiku/sdk-inkstone/lib/**/*.js',
  'source/plumbing/node_modules/haiku-serialization/src/**/*.js',
  'source/plumbing/node_modules/haiku-state-object/src/**/*.js',
  'source/plumbing/node_modules/haiku-timeline/lib/**/*.js',
  'source/plumbing/node_modules/haiku-ui-common/lib/**/*.js',
  'source/plumbing/node_modules/haiku-websockets/lib/**/*.js'
]

glob(GLOBS, function (err, files) {
  if (err) throw err

  return async.eachSeries(files, function (file, next) {
    log.log('uglifying ' + file)

    var sourcepath = path.join(ROOT, file)
    var destpath = path.join(ROOT, file)

    try {
      var code = Uglify2.minify(sourcepath, {compress: {unused: false}}).code

      return fse.outputFile(destpath, code, function (err) {
        if (err) return next(err)
        return next()
      })
    } catch (exception) {
      log.log('cannot uglify: ' + exception.message)
      return next()
    }
  }, function (err) {
    if (err) throw err
    log.hat('done uglifying')
  })
})
