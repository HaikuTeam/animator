const async = require('async')
const lodash = require('lodash')
const cp = require('child_process')
const fse = require('fs-extra')
const inquirer = require('inquirer')
const path = require('path')
const argv = require('yargs').argv
const log = require('./helpers/log')

const CompileOrder = require('./helpers/CompileOrder')
const allPackages = require('./helpers/allPackages')()
const groups = lodash.keyBy(allPackages, 'name')
const ROOT = path.join(__dirname, '..')
const plumbingPackage = groups['haiku-plumbing']
const blankProject = path.join(plumbingPackage.abspath, 'test/fixtures/projects/blank-project/')

global.process.env.NODE_ENV = 'development'

/**
 * Run this script when you want to start local development
 */

const DEFAULTS = {
  dev: false,
  folderChoice: 'none'
}

const inputs = lodash.assign({}, DEFAULTS, argv)
delete inputs._
delete inputs.$0

// List of arguments following the command
const args = argv._

const _branch = cp.execSync('git symbolic-ref --short -q HEAD || git rev-parse --short HEAD').toString().trim()
log.log(`fyi, your current mono branch is ${JSON.stringify(_branch)}\n`)
if (!inputs.branch) inputs.branch = _branch

const instructions = [] // The set of commands we're going to run
const children = [] // Child processes for cleanup later

const FOLDER_CHOICES = {
  'default': null,
  'none': null,
  'blank': blankProject,
  'blank-noclean': blankProject,
  'primitives-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/primitives'),
  'percy-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/percybanking'),
  'simple-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/simple'),
  'SuperComplex-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/SuperComplex'),
  'comet-rotation-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/comet-rotation'),
  'ttt-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/TicTacToe1'),
  'complex-timeline': path.join(ROOT, 'packages/haiku-timeline/test/projects/complex'),
  'SuperComplex-timeline': path.join(ROOT, 'packages/haiku-timeline/test/projects/SuperComplex')
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

if (FOLDER_CHOICES.hasOwnProperty(argv.preset)) {
  inputs.folderChoice = argv.preset
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
          name: 'folderChoice',
          message: 'Project folder (select "none" to use the dashboard)',
          choices: [
            { name: 'none', value: 'none' },
            { name: 'a fresh blank project', value: 'blank' },
            { name: 'the previous "blank" project including content', value: 'blank-noclean' },
            { name: 'primitives (glass)', value: 'primitives-glass' },
            { name: 'percybanking (glass)', value: 'percy-glass' },
            { name: 'simple (glass)', value: 'simple-gl' },
            { name: 'SuperComplex (glass)', value: 'SuperComplex-glass' },
            { name: 'comet-rotation (glass)', value: 'comet-rotation-glass' },
            { name: 'TicTacToe1 (glass)', value: 'ttt-glass' },
            { name: 'complex (timeline)', value: 'complex-timeline' },
            { name: 'SuperComplex (timeline)', value: 'SuperComplex-timeline' }
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
          process.exit()
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

  process.env.DEV = (inputs.dev) ? '1' : undefined
  process.env.HAIKU_SKIP_AUTOUPDATE = '1'
  process.env.HAIKU_PLUMBING_PORT = '1024'

  // These are just stubbed out for completeness' sake
  process.env.HAIKU_RELEASE_ENVIRONMENT = process.env.NODE_ENV
  process.env.HAIKU_RELEASE_BRANCH = 'master'
  process.env.HAIKU_RELEASE_PLATFORM = 'mac'
  process.env.HAIKU_RELEASE_VERSION = require('./../package.json').version
  process.env.HAIKU_AUTOUPDATE_SERVER = 'http://localhost:3002'
  process.env.HAIKU_PLUMBING_URL = 'http://0.0.0.0:1024'

  if (inputs.folderChoice === 'blank') {
    fse.removeSync(blankProject)
    fse.mkdirpSync(blankProject)
    fse.outputFileSync(path.join(blankProject, '.keep'), '')
  }

  CompileOrder.forEach((shortname) => {
    switch (shortname) {
      case 'haiku-player':
        // TS module, but one that uses "develop" for something different than watching.
        instructions.push([shortname, ['yarn', 'watch']])
        break
      case 'haiku-websockets':
      case 'haiku-creator':
      case 'haiku-glass':
      case 'haiku-timeline':
      case 'haiku-plumbing':
        // Babel modules where we can skip the initial (slow) build.
        instructions.push([shortname, ['yarn', 'watch', '--skip-initial-build']])
        break
      case 'haiku-state-object':
      case 'haiku-bytecode':
      case 'haiku-serialization':
        // These don't have watchers or need special treatment.
        break
      default:
        // Standard, new way of doing things: `yarn develop`.
        instructions.push([shortname, ['yarn', 'develop']])
        break
    }
  })
}

function runInstruction (instruction) {
  const pack = groups[instruction[0]]
  const exec = instruction[1]

  const cmd = exec[0]

  const args = exec.slice(1)

  log.log('running ' + cmd + ' ' + JSON.stringify(args) + ' in ' + pack.abspath)

  const child = cp.spawn(cmd, args, { cwd: pack.abspath, env: process.env, stdio: 'inherit' })

  children.push({
    info: { pack, cmd },
    proc: child
  })
}

function go () {
  if (instructions.length < 1) {
    throw new Error('[mono] no instructions found for this dev mode')
  }

  log.hat(`first compiling everything`, 'cyan')
  cp.execSync('yarn run compile-all', { cwd: ROOT, stdio: 'inherit' })

  log.hat(`starting local development`, 'green')

  log.log(JSON.stringify(instructions))

  const chosenFolder = FOLDER_CHOICES[inputs.folderChoice]
  if (chosenFolder) {
    process.env.HAIKU_PROJECT_FOLDER = chosenFolder
  }

  if (chosenFolder) {
    runInstruction(['haiku-plumbing', ['node', './HaikuHelper.js', '--folder=' + blankProject]])
  } else {
    runInstruction(['haiku-plumbing', ['node', './HaikuHelper.js']])
  }

  // Wait 5 seconds for Plumbing to boot up, then start the watchers.
  setTimeout(() => {
    async.each(instructions, function (instruction, next) {
      runInstruction(instruction)
      next()
    })
  }, 5000)
}

process.on('exit', exit)
process.on('SIGINT', exit)
process.on('SIGTERM', exit)
process.on('uncaughtException', exit)

function exit () {
  log.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')
  log.log('exiting; telling children to interrupt')
  log.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$')

  children.forEach(function (child, index) {
    if (child.proc.stdin) child.stdin.pause()
    log.log('$$$$$ ' + index + ' ' + JSON.stringify(child.info))
    child.proc.kill('SIGKILL')
  })
}
