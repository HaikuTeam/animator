var async = require('async')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

async.eachSeries(allPackages, function (pack, next) {
  try {
    log.log('\ngit status for ' + pack.name)
    cp.execSync('git status', { cwd: pack.abspath, stdio: 'inherit' })
  } catch (exception) {
    log.log(exception.message)
  }
  return next()
})
