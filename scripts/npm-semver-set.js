var lodash = require('lodash')
var fse = require('fs-extra')
var cp = require('child_process')
var path = require('path')
var argv = require('yargs').argv
var semver = require('semver')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var version = argv.version
if (!version) throw new Error('Version required')
if (!semver.valid(version)) throw new Error('Invalid semver version')

lodash.forEach(allPackages, function (pack) {
  var packageJsonPath = (pack.name === 'haiku-npm')
    ? path.join(pack.abspath, 'haiku.ai', 'package.json')
    : path.join(pack.abspath, 'package.json')
  var packageJson = fse.readJsonSync(packageJsonPath)
  log.log('Setting ' + pack.name + ' to ' + version + ' (was ' + packageJson.version + ')')
  packageJson.version = version
  fse.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
})

var monoJsonPath = path.join(__dirname, '..', 'package.json')
var monoJson = fse.readJsonSync(monoJsonPath)
log.log('Setting mono to ' + version + ' (was ' + monoJson.version + ')')
monoJson.version = version
fse.writeFileSync(monoJsonPath, JSON.stringify(monoJson, null, 2) + '\n')
log.log('Done!')
