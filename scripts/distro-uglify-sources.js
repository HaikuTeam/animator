var async = require('async')
var path = require('path')
var Uglify2 = require('uglify-js')
var glob = require('glob-all')
var log = require('./helpers/log')
var fs = require('fs')

var ROOT = path.join(__dirname, '..')

// File globs with respect to the root of the mono project
var GLOBS = [
  /* TODO */
]

if (GLOBS.length > 0) {
  glob(GLOBS, function (err, files) {
    if (err) throw err

    return async.eachSeries(files, function (file, next) {
      log.log('uglifying', file, '...')

      var sourcepath = path.join(ROOT, file)
      var destpath = path.join(ROOT, file)

      try {
        var result = Uglify2.minify(sourcepath)
        var code = result.code

        return fs.outputFile(destpath, code, function (err) {
          if (err) return next(err)
          return next()
        })
      } catch (exception) {
        log.log('cannot uglify (' + exception.message + ')')
        return next()
      }
    }, function (err) {
      if (err) throw err
      log.hat('done uglifying')
    })
  })
}
