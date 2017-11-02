var fse = require('fs-extra')
var hb = require('handlebars')
var path = require('path')
var ROOT = path.join(__dirname, '..', '..')

module.exports = function writeHackyDynamicDistroConfig (inputs) {
  var src = fse.readFileSync(path.join(ROOT, '_config.js.handlebars')).toString()
  var tpl = hb.compile(src)
  var result = tpl(inputs)

  fse.writeFileSync(path.join(ROOT, 'config.js'), result)
}
