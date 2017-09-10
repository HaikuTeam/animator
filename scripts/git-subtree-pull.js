var async = require('async')
var cp = require('child_process')
var argv = require('yargs').argv
var path = require('path')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var ROOT = path.join(__dirname, '..')

var branch = argv.branch || 'master'

async.eachSeries(allPackages, function (pack, next) {
  log.log('git subtree pulling ' + pack.name)
  try {
    var cmd = `git subtree pull --prefix packages/${pack.name} ${pack.remote} ${branch}`
    log.log(cmd)
    cp.execSync(cmd, { cwd: ROOT, stdio: 'inherit' })
  } catch (exception) {
    log.log(exception.message)
  }
  return next()
})
