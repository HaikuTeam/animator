var lodash = require('lodash')
var fse = require('fs-extra')
var cp = require('child_process')
var path = require('path')
var argv = require('yargs').argv
var semver = require('semver')
var log = require('./helpers/log')
var runScript = require('./helpers/runScript')
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')
var haikuNpmPath = groups['haiku-npm'].abspath
var plumbingPath = groups['haiku-plumbing'].abspath

var VALID_LEVELS = {
  'patch': true,
  'minor': true,
  'major': true
}

var level = argv.level
if (!level) throw new Error('Level required (patch, minor, major)')
if (!VALID_LEVELS[level]) throw new Error('Invalid level')

// First make sure all the packages are normalized to the topmost semver
return runScript('npm-semver-top', [], function (err) {
  if (err) throw err

  // Then go ahead and increment all of them from that normalized semver
  lodash.forEach(allPackages, function (pack) {
    var packageJsonPath = (pack.name === 'haiku-npm')
      ? path.join(pack.abspath, 'haiku.ai', 'package.json')
      : path.join(pack.abspath, 'package.json')
    var packageJson = fse.readJsonSync(packageJsonPath)
    var version = semver.inc(packageJson.version, level)
    log.log('bumping ' + pack.name + ' from ' + packageJson.version + ' to ' + version)
    packageJson.version = version
    fse.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  })

  log.log('setting plumbing\'s haiku.ai dependency version')
  var plumbingPackageJsonPath = path.join(plumbingPath, 'package.json')
  var plumbingPackageJson = fse.readJsonSync(plumbingPackageJsonPath)
  var haikuaiPackageJsonPath = path.join(haikuNpmPath, 'haiku.ai', 'package.json')
  var haikuaiPackageJson = fse.readJsonSync(haikuaiPackageJsonPath)
  plumbingPackageJson.dependencies['haiku.ai'] = haikuaiPackageJson.version
  fse.outputFileSync(plumbingPackageJsonPath, JSON.stringify(plumbingPackageJson, null, 2) + '\n')

  var monoJsonPath = path.join(__dirname, '..', 'package.json')
  var monoJson = fse.readJsonSync(monoJsonPath)
  var version = semver.inc(monoJson.version, level)
  log.log('bumping mono from ' + monoJson.version + ' to ' + version)
  monoJson.version = version
  fse.writeFileSync(monoJsonPath, JSON.stringify(monoJson, null, 2) + '\n')
  log.log('done!')
})
