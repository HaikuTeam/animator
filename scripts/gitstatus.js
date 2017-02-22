var async = require('async')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

async.eachSeries(allPackages, function (pack, next) {
  try {
    log.log(cp.execSync('git status', { cwd: pack.abspath }))
  } catch (exception) {
    log.log(exception.message)
  }
  return next()
})
