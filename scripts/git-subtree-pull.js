const async = require('async')
const cp = require('child_process')
const argv = require('yargs').argv
const path = require('path')
const log = require('./helpers/log')
const ROOT = path.join(__dirname, '..')

const branch = argv.branch || 'master'
const packageName = argv.package

if (!packageName) {
  throw new Error('a --package argument is required')
}

const [pack] = require('./helpers/allPackages')(packageName)

log.hat(`pulling changes from git subtree for ${packageName} on ${branch}`)

try {
  // Git subtree doesn't seem to like it unless you fetch changes first
  [
    `git fetch ${pack.remote} ${branch}`,
    `git subtree pull --squash --prefix packages/${pack.name} ${pack.remote} ${branch}`
  ].forEach((cmd) => {
    log.log(cmd)
    cp.execSync(cmd, { cwd: ROOT, stdio: 'inherit' })
  })
} catch (exception) {
  log.log(exception.message)
}
