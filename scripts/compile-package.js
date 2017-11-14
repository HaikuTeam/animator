var path = require('path')
var cp = require('child_process')
var lodash = require('lodash')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var argv = require('yargs').argv
var async = require('async')
var Uglify2 = require('uglify-js')
var glob = require('glob-all')
var fse = require('fs-extra')

var groups = lodash.keyBy(allPackages, 'name')

var pkg = argv.package
if (!pkg) {
  throw new Error('a --package argument is required')
}

var PACKAGE_PATH = groups[pkg] && groups[pkg].abspath
if (!PACKAGE_PATH) {
  throw new Error(`cannot find package ${pkg}`)
}

log.hat(`compiling ${pkg}`)

if (!process.env.NODE_ENV) {
  // babel-cli requires this to be set for reasons I don't know
  process.env.NODE_ENV = 'development'
}

cp.execSync('yarn run compile', { cwd: PACKAGE_PATH, stdio: 'inherit' })

if (argv.uglify) {
  var globule = path.join(PACKAGE_PATH, argv.uglify)
  log.log('uglifying glob ' + globule)

  glob([globule], function (err, files) {
    if (err) throw err
    return async.eachSeries(files, function (file, next) {
      log.log('uglifying ' + file)

      try {
        var code = Uglify2.minify(file).code
        return fse.outputFile(file, code, function (err) {
          if (err) return next(err)
          return next()
        })
      } catch (exception) {
        log.log('cannot uglify: ' + exception.message)
        return next()
      }
    }, function (err) {
      if (err) throw err
      log.log('done uglifying')
    })
  })
}
