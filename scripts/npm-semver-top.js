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
var interpreterPath = groups['haiku-interpreter'].abspath
var haikuNpmPath = groups['haiku-npm'].abspath
var plumbingPath = groups['haiku-plumbing'].abspath

/**
 * Find the highest semver in all the projects, and set all
 * packages to that version - useful for normalizing versions
 */

var top
lodash.forEach(allPackages, function (pack) {
  var packageJsonPath = (pack.name === 'haiku-npm')
    ? path.join(pack.abspath, 'haiku.ai', 'package.json')
    : path.join(pack.abspath, 'package.json')
  var packageJson = fse.readJsonSync(packageJsonPath)
  if (!top) top = packageJson.version
  if (semver.gt(packageJson.version, top)) top = packageJson.version
})

log.log('highest semver version found is ' + top)

runScript('npm-semver-set', ['--version=' + top], function (err) {
  if (err) throw err
})
