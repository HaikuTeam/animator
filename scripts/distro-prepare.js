var fse = require('fs-extra')
var cp = require('child_process')
var path = require('path')
var log = require('./helpers/log')

function sdir (loc) {
  return JSON.stringify(loc + '/')
}

var ROOT = path.join(__dirname, '..')
var DISTRO_SOURCE = path.join(ROOT, 'source') // Location of distro source code to push
var PLUMBING_SOURCE = path.join(DISTRO_SOURCE, 'plumbing') // Location of plumbing source code to push
var PLUMBING_ORIGIN = path.join(ROOT, 'packages', 'haiku-plumbing') // Source code to use as...source code
var PLUMBING_SOURCE_MODULES = path.join(PLUMBING_SOURCE, 'node_modules')

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

var YARN_REMOVE_FLAGS = [
  '--ignore-engines', // Ignore any (spurious) engine errors
  '--ignore-scripts', // Don't recompile since we already have
  '--prefer-offline', // Use the packages we've already installed locally
  '--non-interactive', // Don't prompt (just in case)
  '--mutex file:/tmp/.yarn-mutex' // Avoid intermittent concurrency bugs in yarn
]

var HAIKU_PLUMBING_SUBPACKAGES = {
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

/**
 * Clear out all the previous contents from a prevous distro run.
 */

cp.execSync(`rm -rf ${JSON.stringify(DISTRO_SOURCE)}`, { cwd: ROOT, stdio: 'inherit' })
cp.execSync(`mkdir -p ${JSON.stringify(PLUMBING_SOURCE)}`, { cwd: ROOT, stdio: 'inherit' })

/**
 * Move the contents of plumbing into the target folder, sans symlinks.
 */

var rsynccmd1 = `rsync ${RSYNC_FLAGS.join(' ')} ${sdir(PLUMBING_ORIGIN)} ${sdir(PLUMBING_SOURCE)}`
log.log(rsynccmd1)
cp.execSync(rsynccmd1, { cwd: ROOT, stdio: 'inherit' })

/**
 * "Manually" install plumbing's Haiku dependencies from our local sources.
 */

for (var pkgdest0 in HAIKU_PLUMBING_SUBPACKAGES) {
  var pkgsrc = HAIKU_PLUMBING_SUBPACKAGES[pkgdest0]
  if (!pkgsrc) continue
  if (pkgsrc === true) pkgsrc = pkgdest0

  var cmds0 = [
    `mkdir -p ${sdir(path.join(PLUMBING_SOURCE_MODULES, pkgdest0))}`,
    `rsync ${RSYNC_FLAGS.join(' ')} ${sdir(path.join(ROOT, 'packages', pkgsrc))} ${sdir(path.join(PLUMBING_SOURCE_MODULES, pkgdest0))}`
  ]

  cmds0.forEach((cmd) => {
    log.log(cmd)
    cp.execSync(cmd, { cwd: ROOT, stdio: 'inherit' })
  })
}

/**
 * Strip any dev dependencies from the plumbing target.
 */

var yarncmd = `yarn install ${YARN_INSTALL_FLAGS.join(' ')}`
log.log(yarncmd)
cp.execSync(yarncmd, { cwd: PLUMBING_SOURCE, stdio: 'inherit' })

/**
 * Clean any Haiku dependencies from the subpackages since they're already installed one level up.
 */

for (var pkgdest1 in HAIKU_PLUMBING_SUBPACKAGES) {
  if (!HAIKU_PLUMBING_SUBPACKAGES[pkgdest1]) continue
  var modpath = path.join(PLUMBING_SOURCE_MODULES, pkgdest1)
  var pkgpath = path.join(modpath, 'package.json')
  var pkg = fse.readJsonSync(pkgpath, { throws: false })
  DEP_TYPES.forEach((type) => {
    if (!pkg) return null
    if (!pkg[type]) return null
    var removals = []
    for (var depname in pkg[type]) {
      if (!HAIKU_PLUMBING_SUBPACKAGES[depname]) continue
      removals.push(depname)
    }
    if (removals.length < 1) return null
    var cmd = `yarn remove ${removals.join(' ')} ${YARN_REMOVE_FLAGS.join(' ')}`
    cp.execSync(cmd, { cwd: modpath, stdio: 'inherit' })
  })
}

/**
 * Strip any dev dependencies from plumbing's Haiku dependencies.
 */

for (var pkgdest2 in HAIKU_PLUMBING_SUBPACKAGES) {
  if (!HAIKU_PLUMBING_SUBPACKAGES[pkgdest2]) continue

  var cmds1 = [
    `yarn install ${YARN_INSTALL_FLAGS.join(' ')}`
  ]

  cmds1.forEach((cmd) => {
    log.log(cmd)
    cp.execSync(cmd, { cwd: path.join(PLUMBING_SOURCE_MODULES, pkgdest2), stdio: 'inherit' })
  })
}
