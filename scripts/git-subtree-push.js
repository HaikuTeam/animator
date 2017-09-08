var async = require('async')
var cp = require('child_process')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var branch = argv.branch || 'master'

async.eachSeries(allPackages, function (pack, next) {
  log.log('git subtree pushing ' + pack.name)
  try {
    var cmd = `git subtree push --squash --prefix packages/${pack.name} ${pack.remote} ${branch}`
    log.log(cmd)
    cp.execSync(cmd, { cwd: pack.abspath, stdio: 'inherit' })
  } catch (exception) {
    log.log(exception.message)
  }
  return next()
})
