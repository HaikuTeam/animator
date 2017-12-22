const fse = require('fs-extra')
const cp = require('child_process')
const path = require('path')
const log = require('./helpers/log')
const CompileOrder = require('./helpers/CompileOrder')
const forceNodeEnvProduction = require('./helpers/forceNodeEnvProduction')

require('./../config')
forceNodeEnvProduction()

const ROOT = path.join(__dirname, '..')
const DISTRO_SOURCE = path.join(ROOT, 'source') // Location of distro source code to push
const PLUMBING_SOURCE = path.join(DISTRO_SOURCE, 'plumbing') // Location of plumbing source code to push
const PLUMBING_SOURCE_MODULES = path.join(PLUMBING_SOURCE, 'node_modules')
const ORIGINS_FOLDER = path.join(ROOT, 'packages')
const PLUMBING_ORIGIN = path.join(ORIGINS_FOLDER, 'haiku-plumbing') // Source code to use as...source code

const DEP_TYPES = [
  'dependencies',
  'devDependencies',
  'optionalDependencies',
  'peerDependencies'
]

const RSYNC_FLAGS = [
  '--archive',
  '--quiet',
  '--recursive', // Include dirs and subdirs
  '--no-links' // Exclude all symlinks - assumed to be haiku internal (we'll inject these)
]

const RSYNC_FLAGS_SHALLOW = [
  '--archive',
  '--quiet',
  '--no-links' // Exclude all symlinks - assumed to be haiku internal (we'll inject these)
]

const YARN_INSTALL_FLAGS_COMMON = [
  '--frozen-lockfile', // Force use of dependencies from yarn.lock
  '--ignore-engines', // Ignore any (spurious) engine errors
  '--non-interactive', // Don't prompt (just in case)
  '--prefer-offline', // Use the packages we've already installed locally
  '--mutex file:/tmp/.yarn-mutex' // Try to avoid intermittent concurrency bugs in yarn
]

const YARN_INSTALL_DEV_FLAGS = YARN_INSTALL_FLAGS_COMMON.concat([
  '--production=false' // Override the NODE_ENV setting when installing dev dependencies
])

const YARN_INSTALL_PROD_FLAGS = YARN_INSTALL_FLAGS_COMMON.concat([
  '--production=true', // Strip out dev dependencies,
  '--force' // Clean out any stripped-out dependencies
])

const HAIKU_SUBPACKAGES = {
  'haiku-bytecode': true,
  '@haiku/cli': 'haiku-cli',
  'haiku-common': true,
  'haiku-creator-electron': 'haiku-creator',
  'haiku-formats': true,
  'haiku-glass': true,
  '@haiku/player': 'haiku-player',
  '@haiku/sdk-client': 'haiku-sdk-client',
  'haiku-sdk-creator': true,
  '@haiku/sdk-inkstone': 'haiku-sdk-inkstone',
  'haiku-serialization': true,
  'haiku-state-object': true,
  'haiku-testing': true,
  'haiku-timeline': true,
  'haiku-ui-common': true,
  'haiku-websockets': true,
  'haiku-fs-extra': false // Special unlinked snowflake, do not overwrite
}

// Rsync-safe directory that assumes transferring contents from one dir to another
function sdir (loc) {
  return JSON.stringify(loc + '/')
}

function remapName (name) {
  if (name === 'haiku-player') return '@haiku/player'
  if (name === 'haiku-sdk-client') return '@haiku/sdk-client'
  if (name === 'haiku-sdk-inkstone') return '@haiku/sdk-inkstone'
  if (name === 'haiku-cli') return '@haiku/cli'
  if (name === 'haiku-creator') return 'haiku-creator-electron'
  return name
}

function eachHaikuSubpackage (iteratee) {
  CompileOrder.forEach((packageName) => {
    const packageNameFixed = remapName(packageName)
    let packageSource = HAIKU_SUBPACKAGES[packageNameFixed]
    if (!packageSource) return null
    if (packageSource === true) packageSource = packageNameFixed
    iteratee(packageNameFixed, path.join(ORIGINS_FOLDER, packageSource))
  })
}

function eachDepType (iteratee) {
  DEP_TYPES.forEach((depType) => {
    iteratee(depType)
  })
}

function eachDepIn (pkg, iteratee) {
  if (!pkg) return null
  eachDepType((depType) => {
    if (!pkg[depType]) return null
    for (const depName in pkg[depType]) {
      iteratee(depName, pkg[depType][depName], depType)
    }
  })
}

function logExec (cwd, cmd) {
  log.log(`${cwd} ${cmd}`)
  return cp.execSync(cmd, { cwd, stdio: 'inherit' })
}

function readJson (abspath) {
  try {
    return fse.readJsonSync(abspath, { throws: false })
  } catch (exception) {
    return null
  }
}

function devCompile (cwd) {
  // Install dev dependencies and compile (if necessary).
  const pkg = readJson(path.join(cwd, 'package.json'))
  if (pkg && pkg.scripts && pkg.scripts.compile) {
    logExec(cwd, `yarn install ${YARN_INSTALL_DEV_FLAGS.join(' ')}`)
    logExec(cwd, `yarn run compile`)
  }
}

function prodInstall (cwd) {
  logExec(cwd, `yarn install ${YARN_INSTALL_PROD_FLAGS.join(' ')}`)
}

function clearPreviousDistroContents () {
  logExec(ROOT, `rm -rf ${JSON.stringify(DISTRO_SOURCE)}`)
  logExec(ROOT, `mkdir -p ${JSON.stringify(PLUMBING_SOURCE)}`)
}

function copyPlumbingContentIntoTargetFolder () {
  logExec(ROOT, `rsync ${RSYNC_FLAGS.join(' ')} ${sdir(PLUMBING_ORIGIN)} ${sdir(PLUMBING_SOURCE)}`)
}

function forceInstallPlumbingDeps () {
  logExec(ROOT, `rm -rf ${JSON.stringify(path.join(PLUMBING_SOURCE, 'yarn.lock'))}`)
  devCompile(PLUMBING_SOURCE)
  prodInstall(PLUMBING_SOURCE)
}

function overwritePlumbingHaikuDepsWithLocalSourceCode (copyShallow) {
  const rsyncFlags = (copyShallow) ? RSYNC_FLAGS_SHALLOW : RSYNC_FLAGS
  eachHaikuSubpackage((packageName, packageOrigin) => {
    const packageInstallTarget = path.join(PLUMBING_SOURCE_MODULES, packageName)
    logExec(ROOT, `rm -rf ${sdir(packageInstallTarget)}`) // Clear the installed one just in case
    logExec(ROOT, `mkdir -p ${sdir(packageInstallTarget)}`) // Make sure we have the folder
    logExec(ROOT, `rsync ${rsyncFlags.join(' ')} ${sdir(packageOrigin)} ${sdir(packageInstallTarget)}`) // Install ours
  })
}

function installAndCompileSubpackages () {
  eachHaikuSubpackage((packageName, packageOrigin) => {
    const packageInstallTarget = path.join(PLUMBING_SOURCE_MODULES, packageName)
    devCompile(packageInstallTarget)
  })
  eachHaikuSubpackage((packageName, packageOrigin) => {
    const packageInstallTarget = path.join(PLUMBING_SOURCE_MODULES, packageName)
    prodInstall(packageInstallTarget)
  })
}

function hoistSubpackageDependenciesIntoPlumbing () {
  const plumbingPkg = fse.readJsonSync(path.join(PLUMBING_SOURCE, 'package.json'))
  eachHaikuSubpackage((packageName, packageOrigin) => {
    const packageInstallTarget = path.join(PLUMBING_SOURCE_MODULES, packageName)
    const subpackagePkg = readJson(path.join(packageInstallTarget, 'package.json'))
    eachDepIn(subpackagePkg, (depName, depVersion, depType) => {
      if (!plumbingPkg[depType]) plumbingPkg[depType] = {}
      plumbingPkg[depType][depName] = depVersion
      delete subpackagePkg[depType][depName]
    })
    fse.writeJsonSync(path.join(packageInstallTarget, 'package.json'), subpackagePkg)
  })
  fse.writeJsonSync(path.join(PLUMBING_SOURCE, 'package.json'), plumbingPkg)
}

function removeAllSubpackageNodeModules () {
  eachHaikuSubpackage((packageName, packageOrigin) => {
    const packageInstallTarget = path.join(PLUMBING_SOURCE_MODULES, packageName)
    const subpackageNodeModulesDir = sdir(path.join(packageInstallTarget, 'node_modules'))
    logExec(ROOT, `rm -rf ${subpackageNodeModulesDir}`)
  })
}

function copyHackyNodeModulesIntoRequiredLocations () {
  logExec(ROOT, `mkdir -p ${JSON.stringify(path.join(PLUMBING_SOURCE, 'node_modules', 'haiku-glass', 'node_modules'))}`)
  logExec(ROOT, `mkdir -p ${JSON.stringify(path.join(PLUMBING_SOURCE, 'node_modules', 'haiku-creator-electron', 'node_modules'))}`)
  logExec(ROOT, `mkdir -p ${JSON.stringify(path.join(PLUMBING_SOURCE, 'node_modules', 'haiku-timeline', 'node_modules'))}`)
  const ravenSource = sdir(path.join(PLUMBING_SOURCE, 'node_modules', 'raven-js'))
  const monacoSource = sdir(path.join(PLUMBING_SOURCE, 'node_modules', 'monaco-editor'))
  logExec(ROOT, `rsync ${RSYNC_FLAGS.join(' ')} ${ravenSource} ${sdir(path.join(PLUMBING_SOURCE, 'node_modules', 'haiku-glass', 'node_modules', 'raven-js'))}`)
  logExec(ROOT, `rsync ${RSYNC_FLAGS.join(' ')} ${monacoSource} ${sdir(path.join(PLUMBING_SOURCE, 'node_modules', 'haiku-glass', 'node_modules', 'monaco-editor'))}`)
  logExec(ROOT, `rsync ${RSYNC_FLAGS.join(' ')} ${ravenSource} ${sdir(path.join(PLUMBING_SOURCE, 'node_modules', 'haiku-timeline', 'node_modules', 'raven-js'))}`)
  logExec(ROOT, `rsync ${RSYNC_FLAGS.join(' ')} ${ravenSource} ${sdir(path.join(PLUMBING_SOURCE, 'node_modules', 'haiku-creator-electron', 'node_modules', 'raven-js'))}`)
}

clearPreviousDistroContents()
copyPlumbingContentIntoTargetFolder()
overwritePlumbingHaikuDepsWithLocalSourceCode(true)
hoistSubpackageDependenciesIntoPlumbing()
forceInstallPlumbingDeps()
overwritePlumbingHaikuDepsWithLocalSourceCode()
installAndCompileSubpackages()
removeAllSubpackageNodeModules()
copyHackyNodeModulesIntoRequiredLocations()
logExec(path.join(__dirname, '..'), 'node ./scripts/distro-electron-rebuild.js')
