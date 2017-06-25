var fse = require('fs-extra')
var path = require('path')
var cp = require('child_process')
var ROOT = path.join(__dirname, '..', '..')

function req (mod) {
  try {
    return require(mod)
  } catch (exception) {
    return null
  }
}

module.exports = function allPackages () {
  var names = fse.readdirSync(path.join(ROOT, 'packages'))
  names = names.filter(function (name) {
    if (name[0] === '.') return false
    var abspath = path.join(ROOT, 'packages', name)
    if (!fse.lstatSync(abspath).isDirectory()) return false
    return true
  })
  var packages = names.map(function (name) {
    var abspath = path.join(ROOT, 'packages', name)
    var pkg = req(path.join(abspath, 'package.json')) || {}
    var version = pkg.version
    var sha = cp.execSync('git rev-parse HEAD', { cwd: abspath }).toString().trim()
    var remote = cp.execSync('git config --get remote.origin.url', { cwd: abspath }).toString().trim()
    return {
      name: name,
      abspath: abspath,
      relpath: path.join('packages', name),
      shortname: name.replace('haiku-', ''),
      pkg: pkg,
      pkgname: pkg.name,
      version: version,
      sha: sha,
      remote: remote
    }
  })
  return packages
}
