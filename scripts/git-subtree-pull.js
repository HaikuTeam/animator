const cp = require('child_process')
const argv = require('yargs').argv
const path = require('path')
const log = require('./helpers/log')
const nowVersion = require('./helpers/nowVersion')
const getPackage = require('./helpers/packages')

const ROOT = path.join(__dirname, '..')
const branch = argv.branch || 'master'
const packageName = argv.package
const semver = nowVersion()

if (!packageName) {
  throw new Error('a --package argument is required')
}

const pack = packageName === 'changelog'
  ? {
    name: 'changelog',
    remote: 'git@github.com:HaikuTeam/changelog.git',
    abspath: path.join(ROOT, 'changelog/')
  }
  : getPackage(packageName)

const prefix = packageName === 'changelog' ? 'changelog' : `packages/${pack.name}`

log.hat(`pulling changes from git subtree for ${packageName} on ${branch}`)

const cmd = `git subtree pull --prefix ${prefix} ${pack.remote} ${branch} \
  -m 'auto: subtree pull for ${packageName} at ${semver}'`
log.log(cmd)
cp.execSync(cmd, { cwd: ROOT, stdio: 'inherit' })
