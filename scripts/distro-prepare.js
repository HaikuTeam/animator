const childProcess = require('child_process');
const fse = require('fs-extra');
const path = require('path');
const rimraf = require('rimraf');

const log = require('./helpers/log');
const nowVersion = require('./helpers/nowVersion');
const forceNodeEnvProduction = require('./helpers/forceNodeEnvProduction');

require('./../config');
forceNodeEnvProduction();

const ROOT = global.process.cwd();
const DISTRO_DIR = 'source'; // Location of distro source code to push

const YARN_INSTALL_FLAGS = [
  '--frozen-lockfile', // Force use of dependencies from yarn.lock
  '--non-interactive', // Don't prompt (just in case)
  '--force', // Clean out any stripped-out dependencies
  '--ignore-scripts', // Don't trigger any preinstall/postinstall behaviors.
].join(' ');

function logExec (cwd, cmd) {
  log.log(`${cwd} ${cmd}`);
  return childProcess.execSync(cmd, {cwd, stdio: 'inherit'});
}

// Clear previous contents.
log.log(`Clear previous contents from ${DISTRO_DIR}`);
fse.removeSync(`${DISTRO_DIR}`);

// We need the base distro dir, and also this subdir; two birds/one stone
log.log(`Create distro dirs ${DISTRO_DIR}/changelog/public`);
fse.ensureDirSync(`${DISTRO_DIR}/changelog/public`);

// Place a shim package.json and the necessary bootstrapping files.
fse.writeJsonSync(path.join(DISTRO_DIR, 'package.json'), {
  name: 'haiku',
  description: 'Haiku for Teams',
  author: 'Haiku',
  version: nowVersion(),
  dependencies: require(path.join(global.process.cwd(), 'package.json')).dependencies,
}, {spaces: 2});

log.log(`Copy index.js, config.js and changelogs to ${DISTRO_DIR}`);
fse.copySync('index.js', `${DISTRO_DIR}/index.js`);
fse.copySync('config.js', `${DISTRO_DIR}/config.js`);
fse.copySync('HaikuHelper.js', `${DISTRO_DIR}/HaikuHelper.js`);
fse.copySync('changelog/public/', `${DISTRO_DIR}/changelog/public/`);

// Build everything, then load production dependencies.
logExec(ROOT, `yarn install ${YARN_INSTALL_FLAGS} --production=false`);
logExec(ROOT, `yarn compile-all --force`);
logExec(ROOT, `yarn install ${YARN_INSTALL_FLAGS} --production`);

// Important: if we have any modules self-linked, get rid of them with extreme prejudice.
log.log(`Clear any self-linked module`);
rimraf.sync('packages/*/node_modules/@haiku');
rimraf.sync('packages/*/*/node_modules/@haiku');
rimraf.sync('packages/*/*/node_modules/haiku-*');

// Place node modules in their canonical location.
log.log(`Copy node modules to their canonical location. It may take a while..`);
fse.copySync(path.join(ROOT, 'node_modules'), path.join(ROOT, DISTRO_DIR, 'node_modules'), {dereference: true});

// Restore dev dependencies in mono.
logExec(ROOT, `yarn install ${YARN_INSTALL_FLAGS} --production=false`);
// Uglify sources in release.
logExec(ROOT, 'node ./scripts/distro-uglify-sources.js');
