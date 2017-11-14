var async = require('async')
var cp = require('child_process')
var argv = require('yargs').argv
var path = require('path')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var ROOT = path.join(__dirname, '..')

var branch = argv.branch || 'master'
var pkg = argv.package

if (!pkg) {
  throw new Error('a --package argument is required')
}

log.hat(`pulling changes from git subtree for ${pkg} on ${branch}`)

async.eachSeries(allPackages, function (pack, next) {
  if (pack.name !== pkg) {
    return next()
  }

  try {
    var cmds = [
      // Git subtree doesn't seem to like it unless you fetch changes first
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
