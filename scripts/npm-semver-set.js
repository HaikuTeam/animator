var lodash = require('lodash')
var fse = require('fs-extra')
var path = require('path')
var argv = require('yargs').argv
var semver = require('semver')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')
var haikuNpmPath = groups['haiku-npm'].abspath
var plumbingPath = groups['haiku-plumbing'].abspath

var version = argv.version
if (!version) throw new Error('Version required')
if (!semver.valid(version)) throw new Error('Invalid semver version')

lodash.forEach(allPackages, function (pack) {
  var packageJsonPath = (pack.name === 'haiku-npm')
    ? path.join(pack.abspath, 'at-haiku-player', 'package.json')
    : path.join(pack.abspath, 'package.json')
  var packageJson = fse.readJsonSync(packageJsonPath)
  log.log('setting ' + pack.name + ' to ' + version + ' (was ' + packageJson.version + ')')
  packageJson.version = version
  fse.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
})

log.log('setting plumbing\'s at-haiku-player dependency version')
var plumbingPackageJsonPath = path.join(plumbingPath, 'package.json')
var plumbingPackageJson = fse.readJsonSync(plumbingPackageJsonPath)
var haikuaiPackageJsonPath = path.join(haikuNpmPath, 'at-haiku-player', 'package.json')
var haikuaiPackageJson = fse.readJsonSync(haikuaiPackageJsonPath)
plumbingPackageJson.dependencies['@haiku/player'] = haikuaiPackageJson.version
fse.outputFileSync(plumbingPackageJsonPath, JSON.stringify(plumbingPackageJson, null, 2) + '\n')

var monoJsonPath = path.join(__dirname, '..', 'package.json')
var monoJson = fse.readJsonSync(monoJsonPath)
log.log('setting mono to ' + version + ' (was ' + monoJson.version + ')')
monoJson.version = version
fse.writeFileSync(monoJsonPath, JSON.stringify(monoJson, null, 2) + '\n')
log.log('done!')
