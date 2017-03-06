var cp = require('child_process')
var lodash = require('lodash')
var fse = require('fs-extra')
var semver = require('semver')
var path = require('path')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')

var interpreterPath = groups['haiku-interpreter'].abspath
var haikuNpmPath = groups['haiku-npm'].abspath
var plumbingPath = groups['haiku-plumbing'].abspath

log.log('creating dist builds')
log.log(cp.execSync('npm run dist:dom', { cwd: interpreterPath }))
log.log(cp.execSync('npm run dist:react', { cwd: interpreterPath }))

log.log('moving contents into haiku.ai')
fse.copySync(path.join(interpreterPath, 'dom.bundle.js'), path.join(haikuNpmPath, 'haiku.ai', 'player', 'dom', 'index.js'))
fse.copySync(path.join(interpreterPath, 'react.bundle.js'), path.join(haikuNpmPath, 'haiku.ai', 'player', 'dom', 'react.js'))

log.log('committing bundle changes')
log.log(cp.execSync('git add .', { cwd: haikuNpmPath }))
log.log(cp.execSync('git commit -m "auto: Rebuild haiku.ai bundles"', { cwd: haikuNpmPath }))

var haikuAiPackageJsonPath = path.join(haikuNpmPath, 'haiku.ai', 'package.json')
var haikuAiPackage = require(haikuAiPackageJsonPath)
var haikuAiVersion = haikuAiPackage.version
var bumpedHaikuAiVersion = semver.inc(haikuAiVersion, 'minor')

log.log('bumping haiku.ai semver (' + haikuAiVersion + ' -> ' + bumpedHaikuAiVersion + ')')
haikuAiPackage.version = bumpedHaikuAiVersion
fse.outputFileSync(haikuAiPackageJsonPath, JSON.stringify(haikuAiPackage, null, 2) + '\n')

log.log('committing haiku.ai semver bump')
log.log(cp.execSync('git add .', { cwd: haikuNpmPath }))
log.log(cp.execSync('git commit -m "auto: Bump haiku.ai version"', { cwd: haikuNpmPath }))

if (argv['noPublish']) {
  log.log('skipping publish step')
} else {
  log.log('publishing haiku.ai')
  log.log(cp.execSync('npm publish', { cwd: path.join(haikuNpmPath, 'haiku.ai') }))
}

var plumbingPackageJsonPath = path.join(plumbingPath, 'package.json')
var plumbingPackage = require(plumbingPackageJsonPath)
var previousDepVersion = plumbingPackage.dependencies['haiku.ai']
plumbingPackage.dependencies['haiku.ai'] = bumpedHaikuAiVersion

log.log('bumping plumbing\'s haiku.ai dep version (' + previousDepVersion + ' -> ' + bumpedHaikuAiVersion + ')')
fse.outputFileSync(plumbingPackageJsonPath, JSON.stringify(plumbingPackage, null, 2) + '\n')
log.log(cp.execSync('git add package.json', { cwd: plumbingPath }))
log.log(cp.execSync('git commit -m "auto: Bump haiku.ai version"', { cwd: plumbingPath }))
