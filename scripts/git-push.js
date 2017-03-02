var async = require('async')
var cp = require('child_process')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var DEFAULT_ORIGIN = 'master'
var origin = argv.origin || DEFAULT_ORIGIN

async.eachSeries(allPackages, function (pack, next) {
  log.log('git pushing ' + pack.name)
  try {
    cp.execSync('git push origin HEAD:' + origin, { cwd: pack.abspath })
  } catch (exception) {
    log.log(exception.message)
  }
  return next()
})
