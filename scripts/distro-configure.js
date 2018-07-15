const argv = require('yargs').argv;
const fse = require('fs-extra');
const os = require('os');
const path = require('path');
const lodash = require('lodash');
const inquirer = require('inquirer');
const log = require('./helpers/log');
const writeHackyDynamicDistroConfig = require('./helpers/writeHackyDynamicDistroConfig');
const forceNodeEnvProduction = require('./helpers/forceNodeEnvProduction');

let ROOT = path.join(__dirname, '..');
let ENVS = {development: true, production: true};

forceNodeEnvProduction();

function getReleasePlatform () {
  switch (os.platform()) {
    case 'darwin':
      return 'mac';
    case 'win32':
      return 'windows';
    case 'linux':
      return 'linux';
    default:
      throw new Error('Unknown operating system');
  }
}

function getReleaseArchitecture () {
  return os.arch();
}

let inputs = lodash.assign({
  branch: 'master',
  environment: 'production',
  appenv: 'production', // sets NODE_ENV in the running app and the autoupdate channel
  uglify: false,
  upload: true,
  shout: true,
  platform: getReleasePlatform(),
  architecture: getReleaseArchitecture(),
  version: fse.readJsonSync(path.join(ROOT, 'package.json')).version,
}, argv);

delete inputs.$0;
delete inputs._;

if (!argv['non-interactive']) {
  inquirer.prompt([
    {
      type: 'input',
      name: 'environment',
      message: `Environment tag:`,
      default: inputs.environment,
    },
    {
      type: 'confirm',
      name: 'uglify',
      message: 'Obfuscate source code in bundle?:',
      default: inputs.uglify,
    },
    {
      type: 'confirm',
      name: 'upload',
      message: 'Upload to public distro server?:',
      default: inputs.upload,
    },
    {
      type: 'confirm',
      name: 'shout',
      message: 'Notify our internal Slack account about build progress?:',
      default: inputs.shout,
    },
  ]).then((answers) => {
    lodash.assign(inputs, answers);

    if (inputs.uglify === false && inputs.environment === 'production') {
      throw new Error(`refusing to create a non-obfuscated build for 'production'`);
    }

    if (!ENVS[inputs.environment]) {
      throw new Error(`the 'environment' tag must be a member of ${JSON.stringify(ENVS)}`);
    }

    if (!inputs.version) {
      throw new Error(`a 'version' semver tag is required`);
    }

    log.log(`using these inputs: ${JSON.stringify(inputs, null, 2)}`);
    inquirer.prompt([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Go for configure?:',
        default: true,
      },
    ]).then((goForConfigureAnswers) => {
      if (goForConfigureAnswers.proceed) {
        writeHackyDynamicDistroConfig(inputs);
      } else {
        process.exit();
      }
    });
  }).catch((exception) => {
    log.log(exception);
    process.exit();
  });
} else {
  console.log(JSON.stringify(inputs));
  writeHackyDynamicDistroConfig(inputs);
}
