var path = require('path')
var fse = require('fs-extra')
var ROOT = path.join(__dirname, '..', '..')

module.exports = function nowVersion () {
  return fse.readJsonSync(path.join(ROOT, 'package.json')).version
}
