'use strict';

var npm = require('npm');
var logger = require('haiku-serialization/src/utils/LoggerInstance');

var argv = process.argv.slice(0);
argv.shift(); // node.js
argv.shift(); // this file
var folder = argv.shift();
var linkees = argv;

logger.info('[master] npm link subprocess called in', folder, 'for linkees', linkees);

if (process.env.HAIKU_SKIP_NPM_LINK === '1') {
  logger.info('[master] env says to skip npm link; skipping');
  process.exit();
}

// I think we have to set this to ensure the npm module installs in the right place
// This is like the -g option or setting a cwd I think?
// npm.prefix = folder

npm.load({ loaded: false, loglevel: 'silent', silent: true, quiet: true, progress: false }, function (err) {
  if (err) throw err;
  return npm.commands.link(linkees, function (err) {
    if (err) {
      logger.info('[master] cannot npm link; proceeding anyway');
    }
    process.exit();
  });
});
//# sourceMappingURL=npm-link-proc.js.map