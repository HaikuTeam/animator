const cp = require('child_process');

const log = require('./log');

const NODE_VERSION = '8.15.1';

module.exports = () => {
  const nodeVersion = cp.execSync('node --version').toString().trim();
  if (nodeVersion !== `v${NODE_VERSION}`) {
    log.warn(`WARNING: you are using node version ${nodeVersion}. We recommend version v${NODE_VERSION}.`);
    log.warn('Get it via:');
    log.warn(`  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.6/install.sh | bash`);
    log.warn(`  nvm install ${NODE_VERSION}`);
    log.warn(`  nvm alias default ${NODE_VERSION}`);
    log.warn('You have been warned!\n');
  } else {
    log.hat(`Using recommended version of Node (${NODE_VERSION})!`);
  }
};
