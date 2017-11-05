var logger = require('haiku-serialization/src/utils/LoggerInstance')
var cp = require('child_process')
var path = require('path')
var fse = require('haiku-fs-extra')
var CANONICAL_PLAYER_SOURCE_CODE_PATH = require('haiku-serialization/src/bll/helpers/getHaikuKnownImportMatch').CANONICAL_PLAYER_SOURCE_CODE_PATH

// Rsync-safe directory that assumes transferring contents from one dir to another
function rsyncableDir (loc) {
  return JSON.stringify(loc + '/')
}

function dictToArr (deps) {
  var arr = []
  for (var name in deps) {
    var version = deps[name]
    if (version) arr.push(name + '@' + version)
    else arr.push(name) // e.g. just 'lodash'
  }
  return arr
}

var DEBOUNCE_TIME = 60 * 1000 // Don't reinstall same deps to same folder for 1 minute
var cache = {}

function installPlayerFromLocalSource (folder, cb) {
  // Copy our local copy of the player into their node_modules directory
  var playerSourcePathSafe = rsyncableDir(CANONICAL_PLAYER_SOURCE_CODE_PATH)
  var destinationDir = path.join(folder, 'node_modules', '@haiku', 'player')
  var destinationSafe = rsyncableDir(destinationDir)
  var playerPkg = fse.readJsonSync(path.join(CANONICAL_PLAYER_SOURCE_CODE_PATH, 'package.json'), { throws: false })
  if (!playerPkg) return cb(null, new Error('Cannot find player package.json'))
  var playerVersion = playerPkg.version
  if (!playerVersion) return cb(null, new Error('Cannot find player version'))
  try {
    fse.mkdirpSync(destinationDir)
    var rsyncCmd = `rsync --archive --quiet --recursive --no-links --exclude node_modules/ ${playerSourcePathSafe} ${destinationSafe}`
    logger.info('[project folder]', rsyncCmd)
    cp.execSync(rsyncCmd, { stdio: 'inherit' })
  } catch (exception) {
    return cb(null, exception)
  }

  // Now update their package.json with the correct player version
  var theirPkg = fse.readJsonSync(path.join(folder, 'package.json'), { throws: false })
  if (!theirPkg) return cb(null, new Error('Cannot read their package.json'))
  if (!theirPkg.dependencies) theirPkg.dependencies = {}
  theirPkg.dependencies['@haiku/player'] = playerVersion
  try {
    logger.info(`[project folder] updating their package.json player version to ${playerVersion}`)
    fse.writeJsonSync(path.join(folder, 'package.json'), theirPkg)
  } catch (exception) {
    return cb(null, exception)
  }

  return cb()
}

function install (folder, dependencies, cb) {
  if (!dependencies) return cb()
  if (Object.keys(dependencies).length < 1) return cb()

  var key = `${folder}-${JSON.stringify(dependencies)}`
  var last = cache[key]
  if (last) {
    var diff = Date.now() - last
    if (diff < DEBOUNCE_TIME) {
      logger.info('[project folder] npm skipping repeat install of', dependencies)
      return cb()
    }
  }

  // Remember to set the cache key so we detect runs that just occurred
  cache[key] = Date.now()

  logger.info('[project folder] npm installing dependencies', dependencies)

  var deps = dictToArr(dependencies)

  var proc = cp.fork(path.join(__dirname, 'npm-install-proc.js'), [folder].concat(deps), { stdio: 'inherit' })

  proc.on('close', function (err) {
    if (err) return cb(err)
    return cb()
  })
}

function link (folder, linkees, cb) {
  // Empty linkees will signal that we want to make ourselves available as a link,
  // as opposed to link "to" another project
  if (!linkees) linkees = []

  logger.info('[project folder] npm linking', linkees)

  var proc = cp.fork(path.join(__dirname, 'npm-link-proc.js'), [folder].concat(linkees), { stdio: 'inherit' })

  proc.on('close', function (err) {
    if (err) return cb(err)
    return cb()
  })
}

module.exports = {
  installPlayerFromLocalSource: installPlayerFromLocalSource,
  install: install,
  link: link
}
