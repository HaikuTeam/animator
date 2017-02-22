var async = require('async')
var lodash = require('lodash')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var groups = lodash.keyBy(allPackages, 'name')

async.eachSeries(allPackages, function (pack, next) {
  log.log('npm linking ' + pack.name)
  cp.execSync('npm link', { cwd: pack.abspath })
  next()
}, function () {
  async.eachSeries(allPackages, function (pack, next) {
    if (!pack.pkg) return next()
    if (!pack.pkg.dependencies) return next()

    for (var depName in groups) {
      if (pack.pkg.dependencies[depName]) {
        log.log('npm linking ' + depName + ' into project ' + pack.name)
        cp.execSync('npm link ' + depName, { cwd: pack.abspath })
      }
    }

    next()
  })
})
