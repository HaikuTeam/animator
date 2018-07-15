const async = require('async');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const argv = require('yargs').argv;
const glob = require('glob');

const allPackages = require('./helpers/packages')();
const log = require('./helpers/log');

if (!process.env.NODE_ENV) {
  // babel-cli requires this to be set for reasons I don't know
  process.env.NODE_ENV = 'development';
}

const getModificationTime = (file) => new Date(fs.statSync(file).mtime);

async.each(allPackages, (pack, done) => {
  if (pack.pkg && pack.pkg.scripts && pack.pkg.scripts.compile) {
    const lastCompileFilename = path.join(pack.abspath, '.last-compile');

    /* Load last compile time from file */
    let lastCompileTime = null;
    if (!argv.force && fs.existsSync(lastCompileFilename)) {
      const lastCompile = require(lastCompileFilename);
      if (lastCompile.hasOwnProperty('lastCompileTime')) {
        lastCompileTime = new Date(lastCompile.lastCompileTime);
      }
    }

    /* Get modified file since last compilation */
    const files = glob.sync(`${pack.abspath}/src/**`, {});
    const modifiedFiles = files.filter((file) => getModificationTime(file) > lastCompileTime);

    /* Compile package if it has any modified file */
    if (modifiedFiles.length > 0) {
      log.warn(`Detected ${modifiedFiles.length} changed file(s) in ${pack.shortname}. Compiling....`);
      cp.execSync('yarn run compile', {cwd: pack.abspath, stdio: 'inherit'});
    } else {
      log.log(`No changes in ${pack.shortname} since last compile. Skipping....`);
    }

    /* Update last compile time */
    lastCompileTime = new Date();
    fs.writeFileSync(lastCompileFilename, `module.exports = ${JSON.stringify({lastCompileTime})};`);

    done();
  } else {
    done();
  }
});
