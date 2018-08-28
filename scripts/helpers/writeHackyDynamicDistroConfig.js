let fse = require('fs-extra');
let hb = require('handlebars');
let path = require('path');
let ROOT = global.process.cwd();

module.exports = function writeHackyDynamicDistroConfig (inputs) {
  const src = fse.readFileSync(path.join(ROOT, '_config.js.handlebars')).toString();
  const tpl = hb.compile(src);
  const result = tpl(inputs);

  fse.writeFileSync(path.join(ROOT, 'config.js'), result);
};
