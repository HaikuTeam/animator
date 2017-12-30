const childProcess = require('child_process')
const fse = require('fs-extra')
const path = require('path')

const log = require('./helpers/log')
const nowVersion = require('./helpers/nowVersion')
const forceNodeEnvProduction = require('./helpers/forceNodeEnvProduction')

require('./../config')
forceNodeEnvProduction()

const ROOT = global.process.cwd()
const DISTRO_DIR = 'source' // Location of distro source code to push
const PACKAGES_DIR = 'packages'

const RSYNC_FLAGS = [
  '--archive',
  '--quiet',
  '--recursive' // Include dirs and subdirs
].join(' ')

const YARN_INSTALL_FLAGS = [
  '--frozen-lockfile', // Force use of dependencies from yarn.lock
  '--non-interactive', // Don't prompt (just in case)
  '--force' // Clean out any stripped-out dependencies
].join(' ')

function logExec (cwd, cmd) {
  log.log(`${cwd} ${cmd}`)
  return childProcess.execSync(cmd, { cwd, stdio: 'inherit' })
}

// Clear previous contents.
logExec(ROOT, `rm -rf source`)
logExec(ROOT, `mkdir -p source/packages`)
// Place a shim package.json and the necessary bootstrapping files.
fse.writeJsonSync(path.join(DISTRO_DIR, 'package.json'), {
  name: 'haiku',
  description: 'Haiku for Teams',
  author: 'Haiku',
  version: nowVersion()
}, {spaces: 2})
logExec(ROOT, `cp index.js config.js ${DISTRO_DIR}`)
// Build everything, then load production dependencies.
logExec(ROOT, `yarn install ${YARN_INSTALL_FLAGS} --production=false`)
logExec(ROOT, `yarn compile-all --force`)
logExec(ROOT, `yarn install ${YARN_INSTALL_FLAGS} --production`)
// Place plumbing in its canonical location minus node_modules.
logExec(
  ROOT,
  `rsync ${RSYNC_FLAGS} --exclude=node_modules ${path.join(PACKAGES_DIR, 'haiku-plumbing')} \
  ${path.join(DISTRO_DIR, 'packages')}`
)
// Hoist node_modules into haiku-plumbing with all workspace symlinks expanded.
logExec(
  ROOT,
  `rsync ${RSYNC_FLAGS} -L node_modules --exclude=haiku-plumbing \
  ${path.join(DISTRO_DIR, 'packages', 'haiku-plumbing')}`
)
// Restore dev dependencies in mono.
logExec(ROOT, `yarn install ${YARN_INSTALL_FLAGS} --production=false`)
// Uglify sources in release.
logExec(ROOT, 'node ./scripts/distro-uglify-sources.js')
// Rebuild.
const ELECTRON_VERSION = fse.readJsonSync(path.join(ROOT, 'package.json')).build.electronVersion
logExec(
  ROOT,
  `yarn electron-rebuild --version ${ELECTRON_VERSION} --module-dir \
  ${path.join(DISTRO_DIR, PACKAGES_DIR, 'haiku-plumbing')}`
)
