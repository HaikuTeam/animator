var path = require('path')
var fse = require('fs-extra')
var ROOT = global.process.cwd()

module.exports = function nowVersion () {
  return fse.readJsonSync(path.join(ROOT, 'package.json')).version
}
