var fse = require('fs-extra')
var cp = require('child_process')
var path = require('path')
var log = require('./helpers/log')
var CompileOrder = require('./helpers/CompileOrder')

require('./../config')

var ROOT = path.join(__dirname, '..')
var DISTRO_SOURCE = path.join(ROOT, 'source') // Location of distro source code to push
var PLUMBING_SOURCE = path.join(DISTRO_SOURCE, 'plumbing') // Location of plumbing source code to push
var PLUMBING_SOURCE_MODULES = path.join(PLUMBING_SOURCE, 'node_modules')
var ORIGINS_FOLDER = path.join(ROOT, 'packages')
var PLUMBING_ORIGIN = path.join(ORIGINS_FOLDER, 'haiku-plumbing') // Source code to use as...source code

var DEP_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies'
]

var RSYNC_FLAGS = [
  '--archive',
  '--quiet',
  '--recursive', // Include dirs and subdirs
  '--no-links' // Exclude all symlinks - assumed to be haiku internal (we'll inject these)
]

var YARN_INSTALL_DEV_FLAGS = [
  '--ignore-engines', // Ignore any (spurious) engine errors
  '--non-interactive', // Don't prompt (just in case)
  '--prefer-offline', // Use the packages we've already installed locally
  '--mutex file:/tmp/.yarn-mutex' // Avoid intermittent concurrency bugs in yarn
]

var YARN_INSTALL_PROD_FLAGS = [
  '--production', // Strip out dev dependencies
  '--force', // Clean out any stripped-out dependencies
  '--ignore-engines', // Ignore any (spurious) engine errors
  '--non-interactive', // Don't prompt (just in case)
  '--prefer-offline', // Use the packages we've already installed locally
  '--mutex file:/tmp/.yarn-mutex' // Avoid intermittent concurrency bugs in yarn
]

if (!process.env.TRAVIS) {
  // If not in CI, don't recompile, since we already have done so locally
  YARN_INSTALL_PROD_FLAGS.push('--ignore-scripts')
  YARN_INSTALL_DEV_FLAGS.push('--ignore-scripts')
}

var HAIKU_SUBPACKAGES = {
  'haiku-bytecode': true,
  'haiku-cli': true,
  'haiku-common': true,
  'haiku-creator-electron': 'haiku-creator',
  'haiku-formats': true,
  'haiku-glass': true,
  '@haiku/player': 'haiku-player',
  'haiku-sdk-client': true,
  'haiku-sdk-creator': true,
  'haiku-sdk-inkstone': true,
  'haiku-serialization': true,
  'haiku-state-object': true,
  'haiku-testing': true,
  'haiku-timeline': true,
  'haiku-websockets': true,
  'haiku-fs-extra': false // Special unlinked snowflake, do not overwrite
}

// Rsync-safe directory that assumes transferring contents from one dir to another
function sdir (loc) {
  return JSON.stringify(loc + '/')
}

function remapName (name) {
  if (name === 'haiku-player') return '@haiku/player'
  if (name === 'haiku-creator') return 'haiku-creator-electron'
  return name
}

function eachHaikuSubpackage (iteratee) {
  CompileOrder.forEach((packageName) => {
    var packageNameFixed = remapName(packageName)
    var packageSource = HAIKU_SUBPACKAGES[packageNameFixed]
    if (!packageSource) return null
    if (packageSource === true) packageSource = packageNameFixed
    iteratee(packageNameFixed, path.join(ORIGINS_FOLDER, packageSource))
  })
}

function eachDepType (iteratee) {
  DEP_TYPES.forEach(function (depType) {
    iteratee(depType)
  })
}

function eachDepIn (pkg, iteratee) {
  if (!pkg) return null
  eachDepType(function (depType) {
    if (!pkg[depType]) return null
    for (var depName in pkg[depType]) {
      iteratee(depName, pkg[depType][depName], depType)
    }
  })
}

function isHaikuSubpackage (depName) {
  return !!HAIKU_SUBPACKAGES[depName]
}

function logExec (cwd, cmd) {
  log.log(`${cwd} ${cmd}`)
  return cp.execSync(cmd, { cwd, stdio: 'inherit' })
}

function installAndCompile (cwd) {
  var pkg = fse.readJsonSync(path.join(cwd, 'package.json'), { throws: false })
  // Install dev dependencies, compile (if necessary), then strip dev dependencies
  logExec(cwd, `yarn install ${YARN_INSTALL_DEV_FLAGS.join(' ')}`)
  if (pkg && pkg.scripts && pkg.scripts.compile) logExec(cwd, `yarn run compile`)
  logExec(cwd, `yarn install ${YARN_INSTALL_PROD_FLAGS.join(' ')}`)
}

// Clear out all the previous contents from a prevous distro run
logExec(ROOT, `rm -rf ${JSON.stringify(DISTRO_SOURCE)}`)
logExec(ROOT, `mkdir -p ${JSON.stringify(PLUMBING_SOURCE)}`)

// Move the contents of plumbing into the target folder, sans symlinks
logExec(ROOT, `rsync ${RSYNC_FLAGS.join(' ')} ${sdir(PLUMBING_ORIGIN)} ${sdir(PLUMBING_SOURCE)}`)

// Remove any Haiku dependencies from the plumbing to avoid installation work
var plumbingPkg = fse.readJsonSync(path.join(PLUMBING_SOURCE, 'package.json'))
var haikuDepsRemovedFromPlumbing = []
eachDepIn(plumbingPkg, function (depName, depVersion, depType) {
  if (isHaikuSubpackage(depName)) {
    delete plumbingPkg[depType][depName]
    haikuDepsRemovedFromPlumbing.push({ depName, depType, depVersion })
  }
})
fse.writeJsonSync(path.join(PLUMBING_SOURCE, 'package.json'), plumbingPkg)

installAndCompile(PLUMBING_SOURCE)

// Install Haiku dependencies "manually" into plumbing from our local sources
eachHaikuSubpackage(function (packageName, packageOrigin) {
  var packageInstallTarget = path.join(PLUMBING_SOURCE_MODULES, packageName)

  logExec(ROOT, `rm -rf ${sdir(packageInstallTarget)}`) // Clear the installed one just in case
  logExec(ROOT, `mkdir -p ${sdir(packageInstallTarget)}`) // Make sure we have the folder
  logExec(ROOT, `rsync ${RSYNC_FLAGS.join(' ')} ${sdir(packageOrigin)} ${sdir(packageInstallTarget)}`) // Install ours

  // Clean Haiku dependencies from the subpackage since they're installed one level up
  var subpackagePkg = fse.readJsonSync(path.join(packageInstallTarget, 'package.json'), { throws: false })
  if (!subpackagePkg) return null

  eachDepIn(subpackagePkg, function (depName, depVersion, depType) {
    if (isHaikuSubpackage(depName)) {
      delete subpackagePkg[depType][depName]
    }
  })
  fse.writeJsonSync(path.join(packageInstallTarget, 'package.json'), subpackagePkg)
})

eachHaikuSubpackage(function (packageName, packageOrigin) {
  var packageInstallTarget = path.join(PLUMBING_SOURCE_MODULES, packageName)
  installAndCompile(packageInstallTarget)
})

// Put plumbing's Haiku dependencies back in package.json so module resolution works
haikuDepsRemovedFromPlumbing.forEach(({ depName, depType, depVersion }) => {
  plumbingPkg[depType][depName] = depVersion
})
fse.writeJsonSync(path.join(PLUMBING_SOURCE, 'package.json'), plumbingPkg)
