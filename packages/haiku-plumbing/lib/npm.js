'use strict';

var logger = require('haiku-serialization/src/utils/LoggerInstance');
var cp = require('child_process');
var path = require('path');

function dictToArr(deps) {
  var arr = [];
  for (var name in deps) {
    var version = deps[name];
    if (version) arr.push(name + '@' + version);else arr.push(name); // e.g. just 'lodash'
  }
  return arr;
}

var DEBOUNCE_TIME = 60 * 1000; // Don't reinstall same deps to same folder for 1 minute
var cache = {};

function install(folder, dependencies, cb) {
  if (!dependencies) return cb();
  if (Object.keys(dependencies).length < 1) return cb();

  var key = folder + '-' + JSON.stringify(dependencies);
  var last = cache[key];
  if (last) {
    var diff = Date.now() - last;
    if (diff < DEBOUNCE_TIME) {
      logger.info('[project folder] npm skipping repeat install of', dependencies);
      return cb();
    }
  }

  // Remember to set the cache key so we detect runs that just occurred
  cache[key] = Date.now();

  logger.info('[project folder] npm installing dependencies', dependencies);

  var deps = dictToArr(dependencies);

  var proc = cp.fork(path.join(__dirname, 'npm-install-proc.js'), [folder].concat(deps), { stdio: 'inherit' });

  proc.on('close', function (err) {
    if (err) return cb(err);
    return cb();
  });
}

function link(folder, linkees, cb) {
  // Empty linkees will signal that we want to make ourselves available as a link,
  // as opposed to link "to" another project
  if (!linkees) linkees = [];

  logger.info('[project folder] npm linking', linkees);

  var proc = cp.fork(path.join(__dirname, 'npm-link-proc.js'), [folder].concat(linkees), { stdio: 'inherit' });

  proc.on('close', function (err) {
    if (err) return cb(err);
    return cb();
  });
}

module.exports = {
  install: install,
  link: link
};
//# sourceMappingURL=npm.js.map