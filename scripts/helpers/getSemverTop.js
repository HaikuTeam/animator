var fse = require('fs-extra')
var semver = require('semver')
var lodash = require('lodash')
var path = require('path')
var allPackages = require('./packages')()

module.exports = function getSemverTop () {
  var top
  lodash.forEach(allPackages, function (pack) {
    var packageJsonPath = path.join(pack.abspath, 'package.json')
    var packageJson = fse.readJsonSync(packageJsonPath)
    if (!top) top = packageJson.version
    if (semver.gt(packageJson.version, top)) top = packageJson.version
  })
  return top
}
