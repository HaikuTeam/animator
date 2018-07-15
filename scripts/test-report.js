const async = require('async');
const cp = require('child_process');
const log = require('./helpers/log');
const allPackages = require('./helpers/packages')();
const unbuildables = require('./helpers/unbuildables');

let hadError = false;
async.each(allPackages, (pack, next) => {
  if (unbuildables.includes(pack.name) || !pack.pkg.scripts || !pack.pkg.scripts['test-report']) {
    next();
    return;
  }

  const command = pack.pkg.scripts['test-report'];
  log.log('fetching test report for ' + pack.name);
  cp.exec(command, {cwd: pack.abspath, stdio: 'inherit'}, (err) => {
    if (err) {
      log.err(`caught error in ${pack.shortname} test-report: ${err.toString()}`);
      hadError = true;
    }
    next();
  });
}, () => {
  if (hadError) {
    global.process.exit(1);
  }
});
