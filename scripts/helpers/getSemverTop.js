const fse = require('fs-extra');
const semver = require('semver');
const lodash = require('lodash');
const path = require('path');
const allPackages = require('./packages')();

module.exports = function getSemverTop() {
  let top;
  lodash.forEach(allPackages, (pack) => {
    const packageJsonPath = path.join(pack.abspath, 'package.json');
    const packageJson = fse.readJsonSync(packageJsonPath);
    if (!top) top = packageJson.version;
    if (semver.gt(packageJson.version, top)) top = packageJson.version;
  });
  return top;
};
