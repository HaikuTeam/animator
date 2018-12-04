let fse = require('haiku-fs-extra');
let filterWalkFolder = require('./filterWalkFolder');

module.exports = function walkFiles (dir, done) {
  return filterWalkFolder(dir, fileOnlyFilter, done);
};

function fileOnlyFilter (abspath, _, fileObj, relpath) {
  if (relpath.match(/(^\.|\/\.|node_modules|bower_components|jspm_modules)/)) {
    return false; // HACK: Skip files we shouldn't be loading (.git, etc)
  }
  return fse.lstatSync(abspath).isFile();
}
