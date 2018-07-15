const async = require('async');
const lodash = require('lodash');
const cp = require('child_process');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const path = require('path');
const argv = require('yargs').argv;
const log = require('./helpers/log');
const spawn = require('cross-spawn');
const os = require('os');

const allPackages = require('./helpers/packages')();
const groups = lodash.keyBy(allPackages, 'shortname');
const ROOT = path.join(__dirname, '..');
const plumbingPackage = groups.plumbing;
const blankProject = path.join(plumbingPackage.abspath, 'test/fixtures/projects/blank-project/');

let mainProcess;

global.process.env.NODE_ENV = global.process.env.NODE_ENV || 'development';

/**
 * Run this script when you want to start local development
 */

const DEFAULTS = {
  dev: true,
  devChoice: 'everything',
  folderChoice: 'none',
  skipInitialBuild: false,
};

const inputs = lodash.assign({}, DEFAULTS, argv);
delete inputs._;
delete inputs.$0;

// List of arguments following the command
const args = argv._;

const branch = cp.execSync('git symbolic-ref --short -q HEAD || git rev-parse --short HEAD').toString().trim();
log.log(`fyi, your current mono branch is ${JSON.stringify(branch)}\n`);
if (!inputs.branch) {
  inputs.branch = branch;
}

const FOLDER_CHOICES = {
  default: null,
  none: null,
  blank: blankProject,
  'blank-noclean': blankProject,
  'MattsPrimitives-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/MattsPrimitives'),
  'primitives-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/primitives'),
  'primitives-misc-1-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/primitives-misc-1'),
  'percy-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/percybanking'),
  'statetransitions-core': path.join(ROOT, 'packages/@haiku/core/demo/projects/statetransitions'),
  'simple-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/simple'),
  'AliensRepro-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/AliensRepro'),
  'SuperComplex-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/SuperComplex'),
  'comet-rotation-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/comet-rotation'),
  'grouping-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/grouping'),
  'ttt-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/TicTacToe1'),
  'Apr91-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/Apr91'),
  'mc1-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/mc1'),
  'mc0-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/mc0'),
  'mc2-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/mc2'),
  'mc3-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/mc3'),
  'mc4-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/mc4'),
  'mc-anim1-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/mc-anim1'),
  'Bricks-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/Bricks'),
  'groupers-1-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/groupers-1'),
  'repeat-1-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/repeat-1'),
  'repeat-2-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/repeat-2'),
  'repeat-2-auto-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/repeat-2-auto'),
  'complex-timeline': path.join(ROOT, 'packages/haiku-timeline/test/projects/complex'),
  'SuperComplex-timeline': path.join(ROOT, 'packages/haiku-timeline/test/projects/SuperComplex'),
  'AliensRepro-timeline': path.join(ROOT, 'packages/haiku-timeline/test/projects/AliensRepro'),
  'Move-timeline': path.join(ROOT, 'packages/haiku-timeline/test/projects/Move'),
  'metapoem2-timeline': path.join(ROOT, 'packages/haiku-timeline/test/projects/metapoem2'),
  'text-content-timeline': path.join(ROOT, 'packages/haiku-timeline/test/projects/text-content'),
};

// Support:
//   yarn start --default
//   yarn start default
//   yarn start --preset=default
if (argv.default === true) {
  argv.preset = 'default';
} else if (!argv.hasOwnProperty('preset') && args.length > 0) {
  argv.preset = args[0];
}

const availablePresets = {
  glass: 'repeat-2-auto-glass',
  timeline: 'complex-timeline',
  blank: 'blank',
  'blank-noclean': 'blank-noclean',
};

if (FOLDER_CHOICES.hasOwnProperty(argv.preset)) {
  inputs.folderChoice = argv.preset;
} else if (availablePresets[argv.preset]) {
  inputs.devChoice = argv.preset;
  inputs.skipInitialBuild = true;
  inputs.folderChoice = availablePresets[argv.preset] || global.process.env.HAIKU_PROJECT_FOLDER;
} else if (argv.preset === 'fast') {
  inputs.skipInitialBuild = true;
} else {
  delete argv.preset;
}

if (argv.preset) {
  log.hat('running automatically with preset ' + argv.preset);
  runAutomatic();
} else {
  runInteractive();
}

function runInteractive () {
  async.series([
    (cb) => {
      inquirer.prompt([
        {
          type: 'list',
          name: 'devChoice',
          message: 'What do you want to develop?',
          choices: [
            {name: 'the whole chimichanga', value: 'everything'},
            {name: 'just glass', value: 'glass'},
            {name: 'just timeline', value: 'timeline'},
          ],
          default: inputs.devChoice,
        },
        {
          type: 'list',
          name: 'folderChoice',
          message: 'Project folder (select "none" to use the dashboard)',
          choices: [
            {name: 'none', value: 'none'},
            {name: 'a fresh blank project', value: 'blank'},
            {name: 'the previous "blank" project including content', value: 'blank-noclean'},
            {name: 'Matt\'s Primitives (glass)', value: 'MattsPrimitives-glass'},
            {name: 'primitives (glass)', value: 'primitives-glass'},
            {name: 'AliensRepro (glass)', value: 'AliensRepro-glass'},
            {name: 'percybanking (glass)', value: 'percy-glass'},
            {name: 'statetransitions (core)', value: 'statetransitions-core'},
            {name: 'simple (glass)', value: 'simple-gl'},
            {name: 'SuperComplex (glass)', value: 'SuperComplex-glass'},
            {name: 'Apr91 (glass)', value: 'Apr91-glass'},
            {name: 'complex (timeline)', value: 'complex-timeline'},
            {name: 'SuperComplex (timeline)', value: 'SuperComplex-timeline'},
            {name: 'AliensRepro (timeline)', value: 'AliensRepro-timeline'},
            {name: 'Move (timeline)', value: 'Move-timeline'},
            {name: 'metapoem2 (timeline)', value: 'metapoem2-timeline'},
          ],
          default: inputs.folderChoice,
        },
        {
          type: 'confirm',
          name: 'dev',
          message: 'Automatically open Chrome Dev Tools?',
          default: inputs.dev,
        },
      ]).then((answers) => {
        lodash.assign(inputs, answers);
        return cb();
      });
    },

    (cb) => {
      log.log(`inputs were: ${JSON.stringify(inputs, null, 2)}`);
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'doProceed',
          message: 'ok to proceed with "start"?',
          default: true,
        },
      ]).then((answers) => {
        if (answers.doProceed) {
          log.log('ok, proceeding...');
          return cb();
        }

        log.log('bailed');
        global.process.exit();
      });
    },
  ], (err) => {
    if (err) {
      throw err;
    }
    runAutomatic();
  });
}

function runAutomatic () {
  setup();
  go();
}

// TODO: Duplicated from distro-configure.js. Move it to
// right place
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

function setup () {
  log.hat(`preparing to develop locally`, 'cyan');

  if (global.process.env.DEV === undefined) {
    global.process.env.DEV = (inputs.dev) ? '0' : undefined;
  }

  global.process.env.HAIKU_SKIP_AUTOUPDATE = '1';
  global.process.env.HAIKU_PLUMBING_PORT = '1024';

  // These are just stubbed out for completeness' sake
  global.process.env.HAIKU_RELEASE_ENVIRONMENT = process.env.NODE_ENV;
  global.process.env.HAIKU_RELEASE_BRANCH = 'master';
  global.process.env.HAIKU_RELEASE_PLATFORM = getReleasePlatform();
  global.process.env.HAIKU_RELEASE_ARCHITECTURE = getReleaseArchitecture();
  global.process.env.HAIKU_RELEASE_VERSION = require('./../package.json').version;
  global.process.env.HAIKU_AUTOUPDATE_SERVER = 'http://localhost:3002';

  if (inputs.devChoice === 'everything') {
    global.process.env.HAIKU_PLUMBING_URL = 'http://0.0.0.0:1024';
    if (inputs.folderChoice === 'blank') {
      fse.removeSync(blankProject);
      fse.mkdirpSync(blankProject);
      fse.outputFileSync(path.join(blankProject, '.keep'), '');
    }
  } else {
    global.process.env.MOCK_ENVOY = true;
  }
}

function go () {
  if (inputs.skipInitialBuild) {
    log.hat('skipping initial build');
  } else {
    log.hat('first compiling everything');
    cp.execSync('yarn run compile-all', {cwd: ROOT, stdio: 'inherit'});
  }

  log.hat('starting local development', 'green');

  const chosenFolder = FOLDER_CHOICES[inputs.folderChoice];
  if (chosenFolder) {
    global.process.env.HAIKU_PROJECT_FOLDER = chosenFolder;
  }

  let cwd = ROOT;
  const binaryArgs = [];
  switch (inputs.devChoice) {
    case 'everything':
      global.process.env.HAIKU_DEBUG = '1';
      binaryArgs.push('electron', '--remote-debugging-port=9222', '.');
      break;
    case 'glass':
      cwd = groups.glass.abspath;
      binaryArgs.push('start');
      break;
    case 'timeline':
      cwd = groups.timeline.abspath;
      binaryArgs.push('start');
      break;
  }

  // Allow anything in .env to override the environment variables we set here.
  require('dotenv').config();
  log.hat('Note: NOT watching for code changes. To watch for code changes, run yarn watch-all in a new tab.');
  mainProcess = spawn('yarn', binaryArgs, {cwd, env: global.process.env, stdio: 'inherit'});

  global.process.on('exit', () => {
    if (mainProcess && !mainProcess.killed) {
      mainProcess.kill('SIGTERM');
    }
  });

  mainProcess.on('exit', global.process.exit);
}
