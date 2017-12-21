const cp = require('child_process')
const argv = require('yargs').argv
const path = require('path')
const log = require('./helpers/log')
const nowVersion = require('./helpers/nowVersion')

const ROOT = path.join(__dirname, '..')
const branch = argv.branch || 'master'
const packageName = argv.package
const semver = nowVersion()

if (!packageName) {
  throw new Error('a --package argument is required')
}

const [pack] = require('./helpers/allPackages')(packageName)

log.hat(`pulling changes from git subtree for ${packageName} on ${branch}`)

if (packageName === 'changelog') {
  log.log('git subtree pulling changelog')
  var changelog = {
    name: 'changelog',
    remote: 'git@github.com:HaikuTeam/changelog.git',
    abspath: path.join(ROOT, 'changelog/')
  }
  try {
    var cmd = `git subtree pull --squash --prefix ${changelog.name} ${changelog.remote} ${branch}`
    log.log(cmd)
    cp.execSync(cmd, { cwd: ROOT, stdio: 'inherit' })
  } catch (exception) {
    log.log(exception.message)
  }
  return
}

try {
  // Git subtree doesn't seem to like it unless you fetch changes first
  [
    `git fetch ${pack.remote} ${branch}`,
    `git subtree pull --squash --prefix packages/${pack.name} ${pack.remote} ${branch} \
     -m 'auto: subtree pull for ${packageName} at ${semver}'`
  ].forEach((cmd) => {
    log.log(cmd)
    cp.execSync(cmd, { cwd: ROOT, stdio: 'inherit' })
  })
} catch (exception) {
  log.log(exception.message)
}
