var async = require('async')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

async.eachSeries(allPackages, function (pack, next) {
  try {
    cp.execSync('git fetch', { cwd: pack.abspath, stdio: 'inherit' })
  } catch (exception) {
    log.log(exception.message)
  }
  return next()
})
