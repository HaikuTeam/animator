var argv = require('yargs').argv
var fse = require('fs-extra')
var path = require('path')
var lodash = require('lodash')
var inquirer = require('inquirer')
var log = require('./helpers/log')
var writeHackyDynamicDistroConfig = require('./helpers/writeHackyDynamicDistroConfig')

var ROOT = path.join(__dirname, '..')
var ENVS = { test: true, development: true, staging: true, production: true }

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
      message: 'Go for configure?:',
      default: true
    }
  ]).then(function (answers) {
    if (answers.proceed) {
      return runit()
    } else {
      process.exit()
    }
  })
}).catch(function (exception) {
  log.log(exception)
  process.exit()
})

function runit () {
  writeHackyDynamicDistroConfig(inputs)
}
