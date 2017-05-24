var async = require('async')
var cp = require('child_process')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var branch = argv.branch || 'master'
var remote = argv.remote || 'origin'

async.eachSeries(allPackages, function (pack, next) {
  log.log('git pushing ' + pack.name)
  try {
    cp.execSync('git push ' + remote + ' HEAD:' + branch, { cwd: pack.abspath })
  } catch (exception) {
    log.log(exception.message)
  }
  return next()
})
