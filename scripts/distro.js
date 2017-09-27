var argv = require('yargs').argv
var fse = require('fs-extra')
var path = require('path')
var lodash = require('lodash')
var moment = require('moment')
var inquirer = require('inquirer')
var log = require('./helpers/log')
var writeHackyDynamicDistroConfig = require('./helpers/writeHackyDynamicDistroConfig')
var runScript = require('./helpers/runScript')
var ROOT = path.join(__dirname, '..')

var ENVS = { test: true, development: true, staging: true, production: true }
var RELEASE_LOG = fse.readJsonSync(path.join(ROOT, 'releases.json'))

var inputs = lodash.assign({}, argv)
delete inputs.$0
delete inputs._

if (!inputs.version) {
  inputs.version = fse.readJsonSync(path.join(ROOT, 'package.json')).version
}

inputs.branch = 'master'

inquirer.prompt([
  {
    type: 'input',
    name: 'environment',
    message: `Environment tag (helps specify the release bucket; affects autoupdate):`,
    default: inputs.environment || 'staging'
  },
  {
    type: 'confirm',
    name: 'uglify',
    message: 'Obfuscate source code in release bundle ("yes" is *required* for production)?:',
    default: false
  },
  {
    type: 'confirm',
    name: 'upload',
    message: 'Upload release to public distro server?:',
    default: false
  },
  {
    type: 'confirm',
    name: 'shout',
    message: 'Notify our internal Slack account about build progress?:',
    default: false
  }
]).then(function (answers) {
  lodash.assign(inputs, answers)

  if (inputs.uglify === false && inputs.environment === 'production') {
    throw new Error(`refusing to create a non-obfuscated build for 'production'`)
  }

  if (!ENVS[inputs.environment]) {
    throw new Error(`the 'environment' tag must be a member of ${JSON.stringify(ENVS)}`)
  }

  if (!inputs.version) {
    throw new Error(`a 'version' semver tag is required`)
  }

  log.log(`using these inputs: ${JSON.stringify(inputs, null, 2)}`)
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'proceed',
      message: 'Ok to proceed with distro?:',
      default: true
    }
  ]).then(function (answers) {
    if (answers.proceed) {
      log.log('ok, proceeding...')
      return runit()
    } else {
      log.log('bailing.')
      process.exit()
    }
  })
}).catch(function (exception) {
  log.log(exception)
  process.exit()
})

function prependReleaseToReleaseLog () {
  RELEASE_LOG.unshift({
    branch: inputs.branch,
    version: inputs.version,
    environment: inputs.environment,
    started: moment().format('YYYYMMDDHHmmss'),
    uglified: inputs.uglify,
    uploaded: null,
    finished: null,
    success: null
  })
  fse.writeJsonSync(path.join(ROOT, 'releases.json'), RELEASE_LOG, { spaces: 2 })
}

function addInfoToMostRecentReleaseLogEntry (info) {
  lodash.assign(RELEASE_LOG[0], info)
  fse.writeJsonSync(path.join(ROOT, 'releases.json'), RELEASE_LOG, { spaces: 2 })
}

function finalizeReleaseLog () {
  addInfoToMostRecentReleaseLogEntry({
    finished: moment().format('YYYYMMDDHHmmss'),
    uploaded: false,
    success: true
  })
}

function runit () {
  writeHackyDynamicDistroConfig(inputs)
  prependReleaseToReleaseLog()

  return runScript('distro-prepare', (err) => {
    if (err) throw err
    return runScript('distro-electron-rebuild', (err) => {
      if (err) throw err
      return runScript('distro-uglify-sources', (err) => {
        if (err) throw err
        return runScript('distro-build', (err) => {
          if (err) throw err
          if (inputs.upload) {
            return runScript('distro-upload', (err) => {
              if (err) throw err
              finalizeReleaseLog()
              log.hat('success! built release and uploaded')
            })
          } else {
            finalizeReleaseLog()
            log.hat('success! built release (but did not upload)')
          }
        })
      })
    })
  })
}
