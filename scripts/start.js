var async = require('async')
var lodash = require('lodash')
var cp = require('child_process')
var fse = require('fs-extra')
var inquirer = require('inquirer')
var path = require('path')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')
var ROOT = path.join(__dirname, '..')
var plumbingPackage = groups['haiku-plumbing']
var blankProject = path.join(plumbingPackage.abspath, 'test/fixtures/projects/blank-project/')
process.env.NODE_ENV = 'development'

/**
 * Run this script when you want to start local development
 */

var DEFAULTS = {
  dev: '1',
  folderChoice: 'blank',
  devChoice: 'everything',
  nodeEnv: 'development',
  skipAutoUpdate: '1',
  plumbingPort: '1024',
  releaseEnvironment: 'development', // stub
  releaseBranch: 'master', // stub
  releasePlatform: 'mac', // stub
  releaseVersion: '0.0.0', // stub
  autoUpdateServer: 'http://localhost:3002',
  plumbingUrl: 'http://0.0.0.0:1024',
  doDevelopCLI: false,
  doDevelopSDKClient: false,
  doDevelopSDKInkstone: false,
  doDevelopSDKCreator: false
}
var inputs = lodash.assign({}, DEFAULTS, argv)
delete inputs._
delete inputs.$0
var _branch = cp.execSync('git symbolic-ref --short -q HEAD').toString().trim()
log.log(`fyi, your current mono branch is ${JSON.stringify(_branch)}\n`)
if (!inputs.branch) inputs.branch = _branch

var instructions = [] // The set of commands we're going to run
var cancelled = false // Whether we were prematurely cancelled
var children = [] // Child processes for cleanup later

var FOLDER_CHOICES = {
  'none': null,
  'blank': blankProject,
  'blank-noclean': blankProject,
  'primitives-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/primitives'),
  'simple-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/simple'),
  'SuperComplex-glass': path.join(ROOT, 'packages/haiku-glass/test/projects/SuperComplex'),
  'complex-timeline': path.join(ROOT, 'packages/haiku-timeline/test/projects/complex'),
  'SuperComplex-timeline': path.join(ROOT, 'packages/haiku-timeline/test/projects/SuperComplex')
}

async.series([
  function (cb) {
    inquirer.prompt([
      {
        type: 'list',
        name: 'devChoice',
        message: 'What do you want to develop?',
        choices: [
          { name: 'the whole enchilada', value: 'everything' },
          { name: 'just glass', value: 'glass' },
          { name: 'just timeline', value: 'timeline' }
        ],
        default: inputs.devChoice
      },
      {
        type: 'list',
        name: 'folderChoice',
        message: 'Project folder (if developing "the whole enchilada", you can select "none" to use the dashboard)',
        choices: [
          { name: 'none', value: 'none' },
          { name: 'a fresh blank project', value: 'blank' },
          { name: 'the previous "blank" project including content', value: 'blank-noclean' },
          { name: 'primitives (glass)', value: 'primitives-glass' },
          { name: 'simple (glass)', value: 'simple-gl' },
          { name: 'SuperComplex (glass)', value: 'SuperComplex-glass' },
          { name: 'complex (timeline)', value: 'complex-timeline' },
          { name: 'SuperComplex (timeline)', value: 'SuperComplex-timeline' }
        ],
        default: inputs.folderChoice
      },
      {
        type: 'confirm',
        name: 'doDevelopCLI',
        message: 'Do you need to develop the CLI too?',
        default: inputs.doDevelopCLI
      },
      {
        type: 'confirm',
        name: 'doDevelopSDKClient',
        message: 'Do you need to develop the SDK client too?',
        default: inputs.doDevelopSDKClient
      },
      {
        type: 'confirm',
        name: 'doDevelopSDKInkstone',
        message: 'Do you need to develop the Inkstone SDK too?',
        default: inputs.doDevelopSDKInkstone
      },
      {
        type: 'confirm',
        name: 'doDevelopSDKCreator',
        message: 'Do you need to develop Envoy/Creator SDK too?',
        default: inputs.doDevelopSDKCreator
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
  setup()
  go()
})


function setup () {
  log.hat(`preparing`, 'cyan')
  process.env.DEV = inputs.dev
  process.env.NODE_ENV = inputs.nodeEnv
  process.env.HAIKU_SKIP_AUTOUPDATE = inputs.skipAutoUpdate
  process.env.HAIKU_PLUMBING_PORT = inputs.plumbingPort
  process.env.HAIKU_RELEASE_ENVIRONMENT = inputs.releaseEnvironment
  process.env.HAIKU_RELEASE_BRANCH = inputs.releaseBranch
  process.env.HAIKU_RELEASE_PLATFORM = inputs.releasePlatform
  process.env.HAIKU_RELEASE_VERSION = inputs.releaseVersion
  process.env.HAIKU_AUTOUPDATE_SERVER = inputs.autoUpdateServer
  process.env.HAIKU_PLUMBING_URL = inputs.plumbingUrl

  var chosenFolder = FOLDER_CHOICES[inputs.folderChoice]

  if (chosenFolder) {
    process.env.HAIKU_PROJECT_FOLDER = chosenFolder
  }

  if (inputs.folderChoice === 'blank') {
    fse.removeSync(blankProject)
    fse.mkdirpSync(blankProject)
    fse.outputFileSync(path.join(blankProject, '.keep'), '')
  }

  if (inputs.devChoice === 'everything') {
    if (chosenFolder) {
      instructions.unshift(['haiku-plumbing', ['node', './HaikuHelper.js', '--folder=' + blankProject], null, 5000])
      instructions.unshift(['haiku-plumbing', ['yarn', 'run', 'watch'], null, 10000])
    } else {
      instructions.unshift(['haiku-plumbing', ['node', './HaikuHelper.js'], null, 5000])
      instructions.unshift(['haiku-plumbing', ['yarn', 'run', 'watch'], null, 10000])
    }
  } else {
    if (inputs.devChoice === 'glass') {
      instructions.unshift(['haiku-glass', ['yarn', 'start'], null, 5000])
    } else if (inputs.devChoice === 'timeline') {
      instructions.unshift(['haiku-timeline', ['yarn', 'start'], null, 5000])
    }
  }

  if (inputs.doDevelopCLI) {
    instructions.push(['haiku-cli', ['yarn', 'run', 'develop']])
  }
  if (inputs.doDevelopSDKClient) {
    instructions.push(['haiku-sdk-client', ['yarn', 'run', 'develop']])
  }
  if (inputs.doDevelopSDKInkstone) {
    instructions.push(['haiku-sdk-inkstone', ['yarn', 'run', 'develop']])
  }
  if (inputs.doDevelopSDKCreator) {
    instructions.push(['haiku-sdk-creator', ['yarn', 'run', 'develop']])
  }
}

function go () {
  if (instructions.length < 1) {
    throw new Error('[mono] no instructions found for this dev mode')
  }

  log.hat(`starting`, 'green')

  log.log(JSON.stringify(instructions))

  async.eachSeries(instructions, function (instruction, next) {
    if (cancelled) return next()

    var pack = groups[instruction[0]]
    var exec = instruction[1]
    var env = instruction[2] || {}
    var wait = instruction[3] || 5000
    var ignoreClose = instruction[4]

    var cmd = exec[0]

    var args = exec.slice(1)

    log.log('running ' + cmd + ' ' + JSON.stringify(args) + ' in ' + pack.abspath)

    var child = cp.spawn(cmd, args, { cwd: pack.abspath, env: lodash.assign(process.env, env), stdio: 'inherit' })

    children.push(child)

    child.on('close', function (code) {
      if (!ignoreClose) {
        cancelled = true

        log.log(cmd + ' closed, exiting all!')

        children.forEach((child) => {
          child.kill()
        })

        process.exit(0)
      } else {
        log.log(cmd + ' closed')
      }
    })

    return setTimeout(next, wait)
  })
}

process.on('exit', exit)
process.on('SIGINT', exit)
process.on('uncaughtException', exit)

function exit () {
  log.log('exiting; telling children to interrupt')

  children.forEach(function (child) {
    child.kill('SIGINT')
  })
}
