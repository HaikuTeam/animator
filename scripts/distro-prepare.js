var fse = require('fs-extra')
var cp = require('child_process')
var path = require('path')
var log = require('./helpers/log')

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
  '--recursive', // Include dirs and subdirs
  '--no-links' // Exclude all symlinks - assumed to be haiku internal (we'll inject these)
]

var YARN_INSTALL_FLAGS = [
  '--production', // Strip out dev dependencies
  '--force', // Clean out any stripped-out dependencies
  '--ignore-engines', // Ignore any (spurious) engine errors
  '--ignore-scripts', // Don't recompile since we already have
  '--prefer-offline', // Use the packages we've already installed locally
  '--non-interactive', // Don't prompt (just in case)
  '--mutex file:/tmp/.yarn-mutex' // Avoid intermittent concurrency bugs in yarn
]

var HAIKU_SUBPACKAGES = {
  'haiku-bytecode': true,
  'haiku-cli': true,
  'haiku-creator-electron': 'haiku-creator',
  'haiku-glass': true,
  '@haiku/player': 'haiku-player',
  'haiku-sdk-client': true,
  'haiku-sdk-creator': true,
  'haiku-sdk-inkstone': true,
  'haiku-serialization': true,
  'haiku-state-object': true,
  'haiku-timeline': true,
  'haiku-websockets': true,
  'haiku-fs-extra': false // Special unlinked snowflake, do not overwrite
}

// Rsync-safe directory that assumes transferring contents from one dir to another
function sdir (loc) {
  return JSON.stringify(loc + '/')
}

function eachHaikuSubpackage (iteratee) {
  for (var packageName in HAIKU_SUBPACKAGES) {
    var packageSource = HAIKU_SUBPACKAGES[packageName]
    if (!packageSource) continue
    if (packageSource === true) packageSource = packageName
    iteratee(packageName, path.join(ORIGINS_FOLDER, packageSource))
  }
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

// Strip any dev dependencies from the plumbing target
logExec(PLUMBING_SOURCE, `yarn install ${YARN_INSTALL_FLAGS.join(' ')}`)

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

  // Strip any dev dependencies from the subpackage target
  logExec(packageInstallTarget, `yarn install ${YARN_INSTALL_FLAGS.join(' ')}`)
})

// Put plumbing's Haiku dependencies back in package.json so module resolution works
haikuDepsRemovedFromPlumbing.forEach(({ depName, depType, depVersion }) => {
  plumbingPkg[depType][depName] = depVersion
})
fse.writeJsonSync(path.join(PLUMBING_SOURCE, 'package.json'), plumbingPkg)
