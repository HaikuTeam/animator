var lodash = require('lodash')
var fse = require('fs-extra')
var cp = require('child_process')
var path = require('path')
var async = require('async')
var argv = require('yargs').argv
var inquirer = require('inquirer')
var log = require('./helpers/log')
var runScript = require('./helpers/runScript')
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')
var interpreterPath = groups['haiku-interpreter'].abspath
var haikuNpmPath = groups['haiku-npm'].abspath
var ROOT = path.join(__dirname, '..')

/**
 * Run this script when you're done making changes and want to push your code.
 */

var inputs = lodash.assign({}, argv)
delete inputs._
delete inputs.$0

var _branch = cp.execSync('git symbolic-ref --short -q HEAD').toString().trim()
log.log(`fyi, your current mono branch is ${JSON.stringify(_branch)}\n`)

if (!inputs.branch) {
  inputs.branch = _branch
}

var _status = cp.execSync('git status').toString().trim()

if (_status.match(/untracked content/ig)) {
  log.log('you have untracked content. add and commit (or discard) those changes first, then try this again.\n')
  log.log(`git status fyi:\n\n${_status}\n`)
  process.exit()
} else if (_status.match(/modified content/ig)) {
  log.log('you\'ve modified content but not committed it. commit (or discard) those changes first, then try this again.\n')
  log.log(`git status fyi:\n\n${_status}\n`)
  process.exit()
} else if (_status.match(/unmerged paths/ig)) {
  log.log('you have merge conflicts. fix those conflicts first, then try this again.\n')
  log.log(`git status fyi:\n\n${_status}\n`)
  process.exit()
}

async.series([
  function (cb) {
    inquirer.prompt([
      {
        type: 'input',
        name: 'branch',
        message: 'Branch:',
        default: inputs.branch || 'master'
      },
      {
        type: 'input',
        name: 'remote',
        message: 'Remote:',
        default: inputs.origin || 'origin'
      },
      {
        type: 'input',
        name: 'semverBumpLevel',
        message: 'Semver bump level:',
        default: inputs.semverBumpLevel || 'patch'
      },
      {
        type: 'confirm',
        name: 'doPushToNpmRegistry',
        message: 'Push to npm registry?',
        default: true
      },
      {
        type: 'input',
        name: 'commitMessage',
        message: 'Commit message:',
        default: inputs.commitMessage || 'auto: Housekeeping'
      }
    ]).then(function (answers) {
      lodash.assign(inputs, answers)
      log.log(`finalize inputs were: ${JSON.stringify(inputs, null, 2)}`)
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'doProceed',
          message: 'Ok to proceed?',
          default: true
        }
      ]).then(function (answers) {
        if (answers.doProceed) {
          log.log('ok, proceeding...')
          return cb()
        } else {
          log.log('bailed.')
          process.exit()
        }
      })
    })
  },
  function (cb) {
    return runScript('git-pull', [`--branch=${inputs.branch}`, `--remote=${inputs.remote}`], cb)
  },
  function (cb) {
    return runScript('npm-semver-inc', [`--level=${inputs.semverBumpLevel}`], cb)
  },
  function (cb) {
    log.log('creating public framework builds')
    cp.execSync('npm run dist:dom', { cwd: interpreterPath, stdio: 'inherit' })
    cp.execSync('npm run dist:react', { cwd: interpreterPath, stdio: 'inherit' })
    log.log('moving public framework builds into at-haiku-player')
    fse.copySync(path.join(interpreterPath, 'dom.bundle.js'), path.join(haikuNpmPath, 'at-haiku-player', 'dom', 'index.js'))
    fse.copySync(path.join(interpreterPath, 'react.bundle.js'), path.join(haikuNpmPath, 'at-haiku-player', 'dom', 'react.js'))
    cb()
  },
  function (cb) {
    return runScript('sha-norm', [`--branch=${inputs.branch}`, `--remote=${inputs.remote}`], cb)
  },
  function (cb) {
    return runScript('git-ac', [`--message=${JSON.stringify(inputs.commitMessage)}`], cb)
  },
  function (cb) {
    return runScript('git-push', [`--branch=${inputs.branch}`, `--remote=${inputs.remote}`], cb)
  },
  function (cb) {
    if (inputs.doPushToNpmRegistry) {
      log.log('publishing @haiku/player to the npm registry')
      cp.execSync('npm publish --access public', { cwd: path.join(haikuNpmPath, 'at-haiku-player'), stdio: 'inherit' })
      return cb()
    } else {
      log.log('skipping npm publish step because you said so')
      return cb()
    }
  },
  function (cb) {
    log.log('finishing up git cleanup in mono itself')
    try {
      cp.execSync('git add --all .', { cwd: ROOT, stdio: 'inherit' })
      cp.execSync('git commit -m "auto: Housekeeping"', { cwd: ROOT, stdio: 'inherit' })
      cp.execSync('git pull ' + inputs.remote + ' ' + inputs.branch, { cwd: ROOT, stdio: 'inherit' })
      cp.execSync('git push ' + inputs.remote + ' HEAD:' + inputs.branch, { cwd: ROOT, stdio: 'inherit' })
      return cb()
    } catch (exception) {
      log.log('there was error doing git cleanup in mono itself. please fix conflicts, commit, and push mono manually')
      return cb()
    }
  }
], function (err) {
  if (err) throw err
  log.log('finalized!')
})
