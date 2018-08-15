const async = require('async');
const path = require('path');
const uglifyES = require('uglify-es');
const glob = require('glob-all');
const log = require('./helpers/log');
const fse = require('fs-extra');

const ROOT = global.process.cwd();

// File globs with respect to the root of the mono project.
glob(
  [
    'source/node_modules/haiku-*/**/*.js',
    'source/node_modules/@haiku/**/*.js',
    'source/*.js',
    'source/package.json',
  ],
  (err, files) => {
    if (err) {
      throw err;
    }

    async.eachSeries(files, (file, next) => {
      log.log('uglifying ' + file);

      const sourcePath = path.join(ROOT, file);
      fse.readFile(sourcePath, (readFileError, data) => {
        if (readFileError) {
          log.log(`cannot read ${sourcePath}`);
          next();
          return;
        }
        const uglified = uglifyES.minify(data.toString(), {compress: {unused: false}, mangle: true, toplevel: true});
        if (uglified.error) {
          log.log(`cannot uglify ${sourcePath}`);
          next();
          return;
        }
        fse.outputFile(sourcePath, uglified.code, (outputFileError) => {
          next(outputFileError);
        });
      });
    }, (finalError) => {
      if (finalError) {
        throw finalError;
      }
      log.hat('done uglifying');
    });
  },
);
