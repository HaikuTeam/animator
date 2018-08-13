const cp = require('child_process');

const log = require('./log');

const YARN_VERSION = '1.9.4';

module.exports = () => {
  const yarnVersion = cp.execSync('yarn --version').toString().trim();
  if (yarnVersion !== YARN_VERSION) {
    log.warn(`WARNING: you are using yarn version ${yarnVersion}. We recommend version ${YARN_VERSION}.`);
    log.warn('Get it via:');
    log.warn(`  curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version ${YARN_VERSION}`);
    log.warn('You have been warned!\n');
  } else {
    log.hat(`Using recommended version of yarn (${YARN_VERSION})!`);
  }
};
