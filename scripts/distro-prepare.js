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

const RSYNC_FLAGS = [
  '--archive',
  '--quiet',
  '--recursive', // Include dirs and subdirs
  '-L',
].join(' ')

const YARN_INSTALL_FLAGS = [
  '--frozen-lockfile', // Force use of dependencies from yarn.lock
  '--non-interactive', // Don't prompt (just in case)
  '--force', // Clean out any stripped-out dependencies
  '--ignore-scripts', // Don't trigger any preinstall/postinstall behaviors.
].join(' ')

function logExec (cwd, cmd) {
  log.log(`${cwd} ${cmd}`)
  return childProcess.execSync(cmd, { cwd, stdio: 'inherit' })
}

// Clear previous contents.
logExec(ROOT, `rm -rf ${DISTRO_DIR}`)
logExec(ROOT, `mkdir -p ${DISTRO_DIR}`)
// Place a shim package.json and the necessary bootstrapping files.
fse.writeJsonSync(path.join(DISTRO_DIR, 'package.json'), {
  name: 'haiku',
  description: 'Haiku for Teams',
  author: 'Haiku',
  version: nowVersion(),
  dependencies: require(path.join(global.process.cwd(), 'package.json')).dependencies
}, {spaces: 2})
logExec(ROOT, `cp index.js config.js ${DISTRO_DIR}`)
// Build everything, then load production dependencies.
logExec(ROOT, `yarn install ${YARN_INSTALL_FLAGS} --production=false`)
logExec(ROOT, `yarn compile-all --force`)
logExec(ROOT, `yarn install ${YARN_INSTALL_FLAGS} --production`)
// Important: if we have any modules self-linked, get rid of them with extreme prejudice.
logExec(ROOT, `rm -rf packages/*/node_modules/@haiku packages/*/node_modules/haiku-* \
                      packages/*/*/node_modules/@haiku packages/*/*/node_modules/haiku-*`)
// Place node modules in their canonical location.
logExec(ROOT, `rsync ${RSYNC_FLAGS} node_modules ${DISTRO_DIR}`)
// Restore dev dependencies in mono.
logExec(ROOT, `yarn install ${YARN_INSTALL_FLAGS} --production=false`)
// Uglify sources in release.
logExec(ROOT, 'node ./scripts/distro-uglify-sources.js')
// Rebuild.
logExec(ROOT, `yarn electron-rebuild --module-dir ${path.join(DISTRO_DIR, 'node_modules', 'nodegit')}`)
