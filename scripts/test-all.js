const async = require('async');
const cp = require('child_process');
const log = require('./helpers/log');
const allPackages = require('./helpers/packages')();
const unbuildables = require('./helpers/unbuildables');

async.eachSeries(allPackages, (pack, next) => {
  if (unbuildables.includes(pack.name) || !pack.pkg.scripts || !pack.pkg.scripts.test) {
    next();
    return;
  }

  try {
    log.log('running tests in ' + pack.name);
    cp.execSync('yarn run test', {cwd: pack.abspath, stdio: 'inherit'});
  } catch (exception) {
    log.err(exception.message);
  }
  return next();
});
