const cp = require('child_process');

const openSourcePackages = require('./helpers/openSourcePackages');
const openSourceProjects = require('./helpers/openSourceProjects');
const log = require('./helpers/log');
const nowVersion = require('./helpers/nowVersion');

const ROOT = global.process.cwd();
const processOptions = {cwd: ROOT, stdio: 'inherit'};

// Compile packages.
cp.execSync('yarn install --frozen-lockfile', processOptions);
cp.execSync('yarn compile-all --force', processOptions);
openSourcePackages.forEach((pack) => {
  const compileCommand = `node ./scripts/compile-package.js --package=${pack.name}`;
  if (!openSourceProjects.has(pack.name) || pack.name.startsWith('haiku-')) {
    // Uglify pure dependencies.
    cp.execSync(`${compileCommand} --uglify=lib/**/*.js`, processOptions);
  }
});

// @haiku/core needs a special build.
cp.execSync(`node ./scripts/build-core.js --skip-compile=1`, processOptions);

// Tag the release.
cp.execSync(`git tag -a ${nowVersion()} -m 'release ${nowVersion()}'`);
cp.execSync(`git push --tags`);

openSourcePackages.forEach((pack) => {
  // Publish package to NPM as is.
  cp.execSync(`node ./scripts/publish-package.js --package=${pack.name}`, processOptions);
});

// Publish @haiku/core to CDN.
cp.execSync(`node ./scripts/upload-cdn-core.js`, processOptions);
