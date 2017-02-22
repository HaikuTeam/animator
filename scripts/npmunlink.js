var async = require('async')
var lodash = require('lodash')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var groups = lodash.keyBy(allPackages, 'name')

async.eachSeries(allPackages, function (pack, next) {
  if (!pack.pkg) return next()
  if (!pack.pkg.dependencies) return next()

  for (var depName in groups) {
    if (pack.pkg.dependencies[depName]) {
      log.log('npm unlinking ' + depName + ' from project ' + pack.name)
      cp.execSync('npm unlink ' + depName, { cwd: pack.abspath })
    }
  }

  next()
}, function() {
  async.eachSeries(allPackages, function (pack, next) {
    log.log('npm unlinking ' + pack.name)
    cp.execSync('npm unlink', { cwd: pack.abspath })
    next()
  })
})
