const async = require('async')
const lodash = require('lodash')
const cp = require('child_process')
const fse = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')
const argv = require('yargs').argv
const log = require('./helpers/log')

const allPackages = require('./helpers/packages')()
const groups = lodash.keyBy(allPackages, 'shortname')
const ROOT = path.join(__dirname, '..')
const plumbingPackage = groups['plumbing']
const blankProject = path.join(plumbingPackage.abspath, 'test/fixtures/projects/blank-project/')

let watcher
let mainProcess

global.process.env.NODE_ENV = 'development'

/**
 * Run this script when you want to start local development
 */

const DEFAULTS = {
  dev: false,
  devChoice: 'everything',
  folderChoice: 'none',
  skipInitialBuild: false
}

const inputs = lodash.assign({}, DEFAULTS, argv)
delete inputs._
delete inputs.$0

// List of arguments following the command
const args = argv._

const _branch = cp.execSync('git symbolic-ref --short -q HEAD || git rev-parse --short HEAD').toString().trim()
log.log(`fyi, your current mono branch is ${JSON.stringify(_branch)}\n`)
if (!inputs.branch) inputs.branch = _branch

const FOLDER_CHOICES = {
  'default': null,
  'none': null,
  'blank': blankProject,
  'blank-noclean': blankProject,
  'primitives-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/primitives'),
  'percy-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/percybanking'),
  'simple-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/simple'),
  'AliensRepro-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/AliensRepro'),
  'SuperComplex-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/SuperComplex'),
  'comet-rotation-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/comet-rotation'),
  'ttt-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/TicTacToe1'),
  'complex-timeline': path.join(ROOT, 'packages/haiku-timeline/test/projects/complex'),
  'SuperComplex-timeline': path.join(ROOT, 'packages/haiku-timeline/test/projects/SuperComplex'),
  'AliensRepro-timeline': path.join(ROOT, 'packages/haiku-timeline/test/projects/AliensRepro')
}

// Support:
//   yarn start --default
//   yarn start default
//   yarn start --preset=default
if (argv.default === true) {
  argv.preset = 'default'
} else if (!argv.hasOwnProperty('preset') && args.length > 0) {
  argv.preset = args[0]
}

const availablePresets = ['glass', 'timeline']

if (FOLDER_CHOICES.hasOwnProperty(argv.preset)) {
  inputs.folderChoice = argv.preset
} else if (availablePresets.includes(argv.preset) && global.process.env.HAIKU_PROJECT_FOLDER) {
  inputs.devChoice = argv.preset
} else if (argv.preset === 'fast') {
  inputs.skipInitialBuild = true
} else {
  delete argv.preset
}

if (argv.preset) {
  log.hat('running automatically with preset ' + argv.preset)
  runAutomatic()
} else {
  runInteractive()
}

function runInteractive () {
  async.series([
    function (cb) {
      inquirer.prompt([
        {
          type: 'list',
          name: 'devChoice',
          message: 'What do you want to develop?',
          choices: [
            { name: 'the whole chimichanga', value: 'everything' },
            { name: 'just glass', value: 'glass' },
            { name: 'just timeline', value: 'timeline' }
          ],
          default: inputs.devChoice
        },
        {
          type: 'list',
          name: 'folderChoice',
          message: 'Project folder (select "none" to use the dashboard)',
          choices: [
            { name: 'none', value: 'none' },
            { name: 'a fresh blank project', value: 'blank' },
            { name: 'the previous "blank" project including content', value: 'blank-noclean' },
            { name: 'primitives (glass)', value: 'primitives-glass' },
            { name: 'AliensRepro (glass)', value: 'AliensRepro-glass' },
            { name: 'percybanking (glass)', value: 'percy-glass' },
            { name: 'simple (glass)', value: 'simple-gl' },
            { name: 'SuperComplex (glass)', value: 'SuperComplex-glass' },
            { name: 'complex (timeline)', value: 'complex-timeline' },
            { name: 'SuperComplex (timeline)', value: 'SuperComplex-timeline' },
            { name: 'AliensRepro (timeline)', value: 'AliensRepro-timeline' }
          ],
          default: inputs.folderChoice
        },
        {
          type: 'confirm',
          name: 'dev',
          message: 'Automatically open Chrome Dev Tools?',
          default: inputs.dev
        }
      ]).then(function (answers) {
        lodash.assign(inputs, answers)
        return cb()
      })
    },

    function (cb) {
      log.log(`inputs were: ${JSON.stringify(inputs, null, 2)}`)
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'doProceed',
          message: 'ok to proceed with "start"?',
          default: true
        }
      ]).then(function (answers) {
        if (answers.doProceed) {
          log.log('ok, proceeding...')
          return cb()
        } else {
          log.log('bailed')
          global.process.exit()
        }
      })
    }
  ], function (err) {
    if (err) throw err
    runAutomatic()
  })
}

function runAutomatic () {
  setup()
  go()
}

function setup () {
  log.hat(`preparing to develop locally`, 'cyan')

  global.process.env.DEV = (inputs.dev) ? '1' : undefined
  global.process.env.HAIKU_SKIP_AUTOUPDATE = '1'
  global.process.env.HAIKU_PLUMBING_PORT = '1024'

  // These are just stubbed out for completeness' sake
  global.process.env.HAIKU_RELEASE_ENVIRONMENT = process.env.NODE_ENV
  global.process.env.HAIKU_RELEASE_BRANCH = 'master'
  global.process.env.HAIKU_RELEASE_PLATFORM = 'mac'
  global.process.env.HAIKU_RELEASE_VERSION = require('./../package.json').version
  global.process.env.HAIKU_AUTOUPDATE_SERVER = 'http://localhost:3002'

  if (inputs.devChoice === 'everything') {
    global.process.env.HAIKU_PLUMBING_URL = 'http://0.0.0.0:1024'
    if (inputs.folderChoice === 'blank') {
      fse.removeSync(blankProject)
      fse.mkdirpSync(blankProject)
      fse.outputFileSync(path.join(blankProject, '.keep'), '')
    }
  } else {
    global.process.env.MOCK_ENVOY = true
  }
}

function go () {
  if (inputs.skipInitialBuild) {
    log.hat('skipping initial build')
  } else {
    log.hat('first compiling everything')
    cp.execSync('yarn run compile-all', { cwd: ROOT, stdio: 'inherit' })
  }

  log.hat('starting local development', 'green')

  const chosenFolder = FOLDER_CHOICES[inputs.folderChoice]
  if (chosenFolder) {
    global.process.env.HAIKU_PROJECT_FOLDER = chosenFolder
  }

  let startDelay = 0
  let cwd = ROOT
  let args = []
  switch (inputs.devChoice) {
    case 'everything':
      // Wait 5 seconds for Plumbing to boot up, then start the watchers.
      startDelay = 5000
      global.process.env.HAIKU_DEBUG = '1'
      args.push('electron', '--enable-logging', '--remote-debugging-port=9222', '.')
      break
    case 'glass':
      cwd = groups.glass.abspath
      args.push('start')
      break
    case 'timeline':
      cwd = groups.timeline.abspath
      args.push('start')
      break
  }

  // Allow anything in .env to override the environment variables we set here.
  require('dotenv').config()
  mainProcess = cp.spawn('yarn', args, { cwd, env: global.process.env, stdio: 'inherit' })

  const watcherTimeout = setTimeout(() => {
    watcher = cp.spawn(
      'node',
      ['./scripts/watch-all.js', `--devChoice=${inputs.devChoice}`],
      { cwd: ROOT, env: global.process.env, stdio: 'inherit' }
    )
  }, startDelay)

  const killWatcher = () => {
    if (watcher) {
      watcher.kill('SIGTERM')
    } else {
      clearTimeout(watcherTimeout)
    }
  }

  global.process.on('exit', () => {
    if (!mainProcess) {
      mainProcess.kill('SIGTERM')
    }

    killWatcher()
  })

  mainProcess.on('exit', () => {
    killWatcher()
    global.process.exit()
  })
}
