var async = require('async')
var cp = require('child_process')
var argv = require('yargs').argv
var path = require('path')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var ROOT = path.join(__dirname, '..')

var branch = argv.branch || 'master'

log.hat(`pulling changes from all git subtrees on ${branch}`)

async.eachSeries(allPackages, function (pack, next) {
  log.log('git subtree pulling ' + pack.name)
  try {
    var cmds = [
      `git fetch ${pack.remote} ${branch}`,
      `git subtree pull --squash --prefix packages/${pack.name} ${pack.remote} ${branch}`
    ]
    cmds.forEach((cmd) => {
      log.log(cmd)
      cp.execSync(cmd, { cwd: ROOT, stdio: 'inherit' })
    })
  } catch (exception) {
    log.log(exception.message)
  }
  return next()
})
