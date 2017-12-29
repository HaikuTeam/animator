const path = require('path');
const fse = require('fs-extra');

const ROOT = global.process.cwd();

module.exports = function nowVersion() {
  return fse.readJsonSync(path.join(ROOT, 'package.json')).version;
};
