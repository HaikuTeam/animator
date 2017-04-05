var lodash = require('lodash')
var fse = require('fs-extra')
var cp = require('child_process')
var path = require('path')
var argv = require('yargs').argv
var semver = require('semver')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var VALID_LEVELS = {
  'patch': true,
  'minor': true,
  'major': true
}

var level = argv.level
if (!level) throw new Error('Level required (patch, minor, major)')
if (!VALID_LEVELS[level]) throw new Error('Invalid level')

lodash.forEach(allPackages, function (pack) {
  var packageJsonPath = (pack.name === 'haiku-npm')
    ? path.join(pack.abspath, 'haiku.ai', 'package.json')
    : path.join(pack.abspath, 'package.json')
  var packageJson = fse.readJsonSync(packageJsonPath)
  var version = semver.inc(packageJson.version, level)
  log.log('Bumping ' + pack.name + ' from ' + packageJson.version + ' to ' + version)
  packageJson.version = version
  fse.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
})

var monoJsonPath = path.join(__dirname, '..', 'package.json')
var monoJson = fse.readJsonSync(monoJsonPath)
var version = semver.inc(monoJson.version, level)
log.log('Bumping mono from ' + monoJson.version + ' to ' + version)
monoJson.version = version
fse.writeFileSync(monoJsonPath, JSON.stringify(monoJson, null, 2) + '\n')
log.log('Done!')
