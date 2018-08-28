let fse = require('fs-extra');
let semver = require('semver');
let lodash = require('lodash');
let path = require('path');
let allPackages = require('./packages')();

module.exports = function getSemverTop () {
  let top;
  lodash.forEach(allPackages, (pack) => {
    const packageJsonPath = path.join(pack.abspath, 'package.json');
    const packageJson = fse.readJsonSync(packageJsonPath);
    if (!top) {
      top = packageJson.version;
    }
    if (semver.gt(packageJson.version, top)) {
      top = packageJson.version;
    }
  });
  return top;
};
