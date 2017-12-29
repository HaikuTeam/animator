const async = require('async');
const path = require('path');
const UglifyES = require('uglify-es');
const glob = require('glob-all');
const log = require('./helpers/log');
const fse = require('fs-extra');

const ROOT = global.process.cwd();

// File globs with respect to the root of the mono project.
glob(
  [
    'source/packages/haiku-plumbing/*.js',
    'source/packages/haiku-plumbing/lib/**/*.js',
    'source/packages/haiku-plumbing/node_modules/haiku-*/**/*.js',
    'source/packages/haiku-plumbing/node_modules/@haiku/**/*.js',
  ],
  (err, files) => {
    if (err) {
      throw err;
    }

    async.eachSeries(files, (file, next) => {
      log.log(`uglifying ${file}`);

      const sourcePath = path.join(ROOT, file);
      fse.readFile(sourcePath, (err, data) => {
        if (err) {
          log.log(`cannot read ${sourcePath}`);
          next();
          return;
        }
        const uglified = UglifyES.minify(data.toString(), {compress: {unused: false}});
        if (uglified.error) {
          log.log(`cannot uglify ${sourcePath}`);
          next();
          return;
        }
        fse.outputFile(sourcePath, uglified.code, (err) => {
          next(err);
        });
      });
    }, (err) => {
      if (err) throw err;
      log.hat('done uglifying');
    });
  },
);
