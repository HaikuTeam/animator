var async = require('async')
var cp = require('child_process')
var path = require('path')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var ROOT = path.join(__dirname, '..')

var branch = argv.branch || 'master'
var pkg = argv.package

if (!pkg) {
  throw new Error('a --package argument is required')
}

log.hat(`pushing changes to git subtree for ${pkg} on ${branch}`)

if (pkg === 'changelog') {
  log.log('git subtree pushing changelog')

  // zb: bit of a hack, but we can pay this down in the off-chance that any this logic needs to extend/scale
  // NOTE: there's no analogue written for subtree-pull. the assumption is that repo will be 'push-only'
  var changelog = {
    name: 'changelog',
    remote: 'git@github.com:HaikuTeam/changelog.git',
    abspath: path.join(ROOT, 'changelog/')
  }

  try {
    var cmd = `git subtree push --squash --prefix ${changelog.name} ${changelog.remote} ${branch}`
    log.log(cmd)
    // cp.execSync(cmd, { cwd: ROOT, stdio: 'inherit' })
  } catch (exception) {
    log.log(exception.message)
  }
} else {

}

async.eachSeries(allPackages, function (pack, next) {
  if (pack.name !== pkg) {
    return next()
  }

  log.log('git subtree pushing ' + pack.name)

  try {
    var cmd = `git subtree push --squash --prefix packages/${pack.name} ${pack.remote} ${branch}`
    log.log(cmd)
    cp.execSync(cmd, { cwd: ROOT, stdio: 'inherit' })
  } catch (exception) {
    log.log(exception.message)
  }

  return next()
})
