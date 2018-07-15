const async = require('async');
const cp = require('child_process');
const argv = require('yargs').argv;
const log = require('./helpers/log');
const allPackages = require('./helpers/packages')();

let args = argv._;
let cmd = args[0];

async.eachSeries(allPackages, (pack, next) => {
  log.log('running command ' + cmd + ' in ' + pack.abspath);
  cp.exec(cmd, {cwd: pack.abspath}, (err, out) => {
    if (err) {
      log.err(err);
      return next(err);
    }
    log.log(out);
    return next();
  });
});
