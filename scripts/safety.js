var lodash = require('lodash')
var cp = require('child_process')
var path = require('path')
var async = require('async')
var argv = require('yargs').argv
var inquirer = require('inquirer')
var moment = require('moment')
var log = require('./helpers/log')
var runScript = require('./helpers/runScript')
var ROOT = path.join(__dirname, '..')

/**
 * Run this script when you just want to check in your code, but aren't ready to finalize yet.
 */

var inputs = lodash.assign({}, argv)
delete inputs._
delete inputs.$0

var originalBranch = cp.execSync('git symbolic-ref --short -q HEAD').toString().trim()
log.log(`fyi, your current mono branch is ${JSON.stringify(originalBranch)}\n`)

log.hat(`~~~ What this script will do ~~~
1. Checkout a new branch
2. Commit _all_ your local changes - including mono - into the new branch
3. Push that branch to all the remote repos
4. Bring you back to the original branch (${originalBranch})
5. Merge those changes into (${originalBranch}) [note: it won't push to ${originalBranch}]
~~~ Please make note of the following disclaimers ~~~
- This will NOT publish to npm
- This will NOT make your version numbers consistent
- This will NOT install anything
- This will NOT take care of merge conflicts (it will commit them)`, 'yellow')

async.series([
  function (cb) {
    inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter your name:',
        default: inputs.name || process.env.USER
      },
      {
        type: 'input',
        name: 'remote',
        message: 'Remote:',
        default: inputs.origin || 'origin'
      },
      {
        type: 'input',
        name: 'commitMessage',
        message: 'Enter a commit message:',
        default: inputs.commitMessage || 'auto: Safety checkin'
      }
    ]).then(function (answers) {
      if (!answers.name) {
        throw new Error('`name` input is required')
      }
      lodash.assign(inputs, answers)
      var branch = `safety-${answers.name}-${moment().format('YYYYMMDDHHmmss')}`
      inquirer.prompt([
        {
          type: 'input',
          name: 'branch',
          message: 'Branch:',
          default: branch || inputs.branch
        }
      ]).then(function (answers) {
        lodash.assign(inputs, answers, {
          originalBranch: originalBranch
        })
        log.log(`safety checkin info is: ${JSON.stringify(inputs, null, 2)}`)
        inquirer.prompt([
          {
            type: 'confirm',
            name: 'doProceed',
            message: 'OK to proceed?',
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
    })
  },
  function (cb) {
    log.hat(`checking out a new branch called ${inputs.branch} for you`)
    // First checkout a new branch in mono...
    try {
      cp.execSync(`git checkout -b ${inputs.branch}`, { cwd: ROOT, stdio: 'inherit' })
    } catch (exception) {
      log.err('there was error setting things up for this; please ask someone on the team for help')
      return cb(exception)
    }
    // Then checkout a new branch in all of the sub-repos
    return runScript('git-checkout-b', [`--branch=${inputs.branch}`], cb)
  },
  function (cb) {
    log.hat(`adding, committing, & pushing all your local changes to branch ${inputs.branch}`)
    return runScript('git-ac', [`--message=${JSON.stringify(inputs.commitMessage)}`], cb)
  },
  function (cb) {
    return runScript('git-push', [`--branch=${inputs.branch}`, `--remote=${inputs.remote}`], cb)
  },
  function (cb) {
    cp.execSync('git add --all .', { cwd: ROOT, stdio: 'inherit' })
    cp.execSync('git commit -m ' + JSON.stringify(inputs.commitMessage), { cwd: ROOT, stdio: 'inherit' })
    cp.execSync('git push ' + inputs.remote + ' HEAD:' + inputs.branch, { cwd: ROOT, stdio: 'inherit' })
    return cb()
  },
  function (cb) {
    log.hat(`bringing you back to ${originalBranch}`)
    cp.execSync(`git checkout ${originalBranch}`, { cwd: ROOT, stdio: 'inherit' })
    return runScript('git-checkout-branch', [`--branch=${originalBranch}`], cb)
  },
  function (cb) {
    return runScript('git-merge-branch', [`--branch=${inputs.branch}`], cb)
  }
], function (err) {
  if (err) throw err
  log.hat(`done!`, 'green')
})
