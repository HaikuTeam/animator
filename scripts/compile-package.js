const path = require('path');
const cp = require('child_process');
const lodash = require('lodash');
const log = require('./helpers/log');
const allPackages = require('./helpers/packages')();
const argv = require('yargs').argv;
const async = require('async');
const uglify2 = require('uglify-js');
const glob = require('glob-all');
const fse = require('fs-extra');

const groups = lodash.keyBy(allPackages, 'name');

const pkg = argv.package;
if (!pkg) {
  throw new Error('a --package argument is required');
}

const PACKAGE_PATH = groups[pkg] && groups[pkg].abspath;
if (!PACKAGE_PATH) {
  throw new Error(`cannot find package ${pkg}`);
}

log.hat(`compiling ${pkg}`);

if (!process.env.NODE_ENV) {
  // babel-cli requires this to be set for reasons I don't know
  process.env.NODE_ENV = 'development';
}

cp.execSync('yarn compile', {cwd: PACKAGE_PATH, stdio: 'inherit'});

if (argv.uglify) {
  const globule = path.join(PACKAGE_PATH, argv.uglify);
  log.log('uglifying glob ' + globule);

  glob([globule], (err, files) => {
    if (err) {
      throw err;
    }
    return async.eachSeries(files, (file, next) => {
      log.log('uglifying ' + file);

      try {
        const code = uglify2.minify(file).code;
        return fse.outputFile(file, code, (writeError) => {
          if (writeError) {
            return next(writeError);
          }
          return next();
        });
      } catch (exception) {
        log.log('cannot uglify: ' + exception.message);
        return next();
      }
    }, (finalErr) => {
      if (finalErr) {
        throw finalErr;
      }
      log.log('done uglifying');
    });
  });
}
