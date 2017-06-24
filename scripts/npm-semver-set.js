var lodash = require('lodash')
var fse = require('fs-extra')
var path = require('path')
var argv = require('yargs').argv
var semver = require('semver')
var log = require('./helpers/log')
var execSync = require('child_process').execSync
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')
var haikuPlayerPath = groups['haiku-player'].abspath
var plumbingPath = groups['haiku-plumbing'].abspath
var cliPath = groups['haiku-cli'].abspath

var version = argv.version
if (!version) throw new Error('Version required')
if (!semver.valid(version)) throw new Error('Invalid semver version')

lodash.forEach(allPackages, function (pack) {
  var packageJsonPath = path.join(pack.abspath, 'package.json')

  var packageJson = fse.readJsonSync(packageJsonPath)
  log.log('setting ' + pack.name + ' to ' + version + ' (was ' + packageJson.version + ')')
  packageJson.version = version
  fse.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
})

log.log('injecting version into CLI help banner')
execSync(`sed -i '' -E "s/(Haiku CLI \\(version )([0-9]+\\.[0-9]+\\.[0-9]+)/\\1${version.toString()}/" ${path.join(cliPath, 'src', 'index.ts')}`) // note this sed syntax is macOS-specific
try {
  execSync('npm run tsc', { cwd: cliPath, stdio: 'inherit' })
} catch (exception) {
  log.log('Failed to run tsc')
}

log.log('setting plumbing\'s at-haiku-player dependency version')
var plumbingPackageJsonPath = path.join(plumbingPath, 'package.json')
var plumbingPackageJson = fse.readJsonSync(plumbingPackageJsonPath)

var haikuPlayerPackageJsonPath = path.join(haikuPlayerPath, 'package.json')
var haikuPlayerPackageJson = fse.readJsonSync(haikuPlayerPackageJsonPath)

plumbingPackageJson.dependencies['@haiku/player'] = haikuPlayerPackageJson.version
fse.outputFileSync(plumbingPackageJsonPath, JSON.stringify(plumbingPackageJson, null, 2) + '\n')

var monoJsonPath = path.join(__dirname, '..', 'package.json')
var monoJson = fse.readJsonSync(monoJsonPath)
log.log('setting mono to ' + version + ' (was ' + monoJson.version + ')')
monoJson.version = version
fse.writeFileSync(monoJsonPath, JSON.stringify(monoJson, null, 2) + '\n')
log.log('done!')
