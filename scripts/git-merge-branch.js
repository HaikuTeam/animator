var async = require('async')
var cp = require('child_process')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var branch = argv.branch
if (!branch) throw new Error('Provide a branch, please!')

async.eachSeries(allPackages, function (pack, next) {
  log.log('git merge ' + branch + ' . in ' + pack.name)
  try {
    cp.execSync('git merge ' + branch, { cwd: pack.abspath })
  } catch (exception) {
    log.log(exception.message)
  }
  return next()
})
