var lodash = require('lodash')
var fse = require('fs-extra')
var path = require('path')
var semver = require('semver')
var log = require('./helpers/log')
var runScript = require('./helpers/runScript')
var allPackages = require('./helpers/allPackages')()

/**
 * Find the highest semver in all the projects, and set all
 * packages to that version - useful for normalizing versions
 */

var top
lodash.forEach(allPackages, function (pack) {
  var packageJsonPath = path.join(pack.abspath, 'package.json')

  var packageJson = fse.readJsonSync(packageJsonPath)

  if (!top) top = packageJson.version

  if (semver.gt(packageJson.version, top)) top = packageJson.version
})

log.log('highest semver version found is ' + top)

runScript('yarn-semver-set', ['--version=' + top], function (err) {
  if (err) throw err
})
