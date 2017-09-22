'use strict';

var npm = require('npm');
var fse = require('haiku-fs-extra');
var path = require('path');
var logger = require('haiku-serialization/src/utils/LoggerInstance');

// This is in a subprocess because unless we do this, we get "#2 Argument was an object"
// errors which there appears to be no other way to work around

var argv = process.argv.slice(0);

argv.shift(); // node.js
argv.shift(); // this file

var folder = argv.shift();
var deps = argv;

logger.info('[master] npm install subprocess called in', folder, 'for deps', deps);

if (process.env.HAIKU_SKIP_NPM_INSTALL === '1') {
  logger.info('[master] env says to skip npm install; skipping');
  process.exit();
}

function depNeedsInstall(name, version) {
  var pkgpath = path.join(folder, 'node_modules', name, 'package.json');

  logger.info('[master] checking if npm dependency ' + name + '@' + version + ' needs install');
  logger.info('[master] using dependency path', pkgpath);

  if (!fse.existsSync(pkgpath)) {
    logger.info('[master] no file found at ' + pkgpath);
    return true; // If no package, we must install
  }

  var pkg = fse.readJsonSync(pkgpath, { throws: false });
  if (!pkg) {
    logger.info('[master] bad json in ' + pkgpath);
    return true;
  }

  if (pkg.version !== version) {
    logger.info('[master] version mismatch in ' + pkgpath + ' (' + version + ' vs ' + pkg.version + ')');
    return true;
  }

  return false;
}

var _doesAnythingNeedInstall = false;
for (var i = 0; i < deps.length; i++) {
  // We already know we need to install; no point continuing the loop
  if (_doesAnythingNeedInstall) {
    continue;
  }

  var dep = deps[i];
  var parts = dep.split(/(?!^)@/i); // handle things like "foo@1.1.1" and "@haiku/foo@1.1.1"
  var name = parts[0];
  var version = parts[1];

  if (depNeedsInstall(name, version)) {
    logger.info('[master] npm dependency ' + dep + ' needs install');
    _doesAnythingNeedInstall = true;
  }
}

if (!_doesAnythingNeedInstall) {
  logger.info('[master] npm install not needed; skipping');
  process.exit();
}

npm.load({ loaded: false, loglevel: 'silent', silent: true, quiet: true, progress: false }, function (err) {
  if (err) throw err;
  return npm.commands.install(folder, deps, function (err) {
    if (err) throw err;
    process.exit();
  });
});
//# sourceMappingURL=npm-install-proc.js.map