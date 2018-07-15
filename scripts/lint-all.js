const async = require('async');
const cp = require('child_process');
const path = require('path');
const log = require('./helpers/log');
const gitStatusInfo = require('./helpers/gitStatusInfo');
const allPackages = require('./helpers/packages')();
const unbuildables = require('./helpers/unbuildables');
const ROOT = path.join(__dirname, '..');

async.eachSeries(allPackages, (pack, next) => {
  if (unbuildables.includes(pack.name)) {
    next();
    return;
  }

  if (pack.pkg.scripts) {
    const command = pack.pkg.scripts.fix || pack.pkg.scripts.lint;
    if (command) {
      try {
        log.log('linting ' + pack.name);
        cp.execSync(command, {cwd: pack.abspath, stdio: 'inherit'});
      } catch (exception) {
        log.err(exception.message);
      }
    }
  }
  next();
}, () => {
  const monoStatus = gitStatusInfo(ROOT);
  delete monoStatus.output;
  const statStr = JSON.stringify(monoStatus, null, 2);
  log.hat(`Here's what things look like in mono now:\n${statStr}\n(This is just FYI. An empty object is ok too.)`);
});
