let path = require('path');
let fse = require('fs-extra');
let ROOT = global.process.cwd();

module.exports = function nowVersion () {
  return fse.readJsonSync(path.join(ROOT, 'package.json')).version;
};
