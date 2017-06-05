var lodash = require('lodash')
var fse = require('fs-extra')
var cp = require('child_process')
var path = require('path')
var async = require('async')
var argv = require('yargs').argv
var inquirer = require('inquirer')
var log = require('./helpers/log')
var gitStatusInfo = require('./helpers/gitStatusInfo')
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

function assertGitStatus () {
  var _statusInfo = gitStatusInfo(ROOT)
  if (_statusInfo.submoduleHasUntrackedContent) {
    log.err('you have untracked content. add and commit (or discard) those changes first, then try this again.\n')
    process.exit(1)
  } else if (_statusInfo.submoduleHasModifiedContent) {
    log.err('you\'ve modified content but not committed it. commit (or discard) those changes first, then try this again.\n')
    process.exit(1)
  } else if (_statusInfo.submoduleHasUnmergedPaths) {
    log.err('you have merge conflicts. fix those conflicts first, then try this again.\n')
    process.exit(1)
  }
}

assertGitStatus()

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
        message: 'Semver bump level (i.e., which number do you want to bump in the `major.minor.patch` string):',
        default: inputs.semverBumpLevel || 'patch'
      },
      {
        type: 'confirm',
        name: 'doLintPackages',
        message: 'Run the linter in all the packages? (warning: this auto-formats code so you may end up with unsaved changes)',
        default: true
      },
      {
        type: 'confirm',
        name: 'doTestPackages',
        message: 'Run automated tests in all the packages? (note: failed tests will _not_ stop this script)',
        default: true
      },
      {
        type: 'confirm',
        name: 'doPushToNpmRegistry',
        message: 'Push to npm registry? (you almost certainly want to say "Y", otherwise npm installs might break)',
        default: true
      },
      {
        type: 'confirm',
        name: 'doUpdateChangelog',
        message: 'Update the changelog? (i.e., do you want to put your commits into the changelog (probably yes))',
        default: true
      },
      {
        type: 'input',
        name: 'commitMessage',
        message: 'Commit message (for the packages):',
        default: inputs.commitMessage || 'auto: Housekeeping'
      },
      {
        type: 'input',
        name: 'finalUberCommitMessage',
        message: 'Final uber-commit message (for mono itself):',
        default: inputs.finalUberCommitMessage || 'auto: Housekeeping'
      }
    ]).then(function (answers) {
      lodash.assign(inputs, answers)
      log.log(`finalize inputs were: ${JSON.stringify(inputs, null, 2)}`)
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
  },
  function (cb) {
    if (inputs.doLintPackages) {
      log.hat('linting all the packages')
      return runScript('lint-all', [], cb)
    } else {
      log.log('skipping linting because you said so')
      return cb()
    }
  },
  function (cb) {
    if (inputs.doTestPackages) {
      log.hat('running tests in all the packages')
      return runScript('test-all', [], cb)
    } else {
      log.log('skipping tests because you said so')
      return cb()
    }
  },
  function (cb) {
    // Need to check that linting/testing didn't create any changes that need to be fixed by a human
    assertGitStatus()
    return cb()
  },
  function (cb) {
    log.hat('fetching & merging git repos for all the packages')
    return runScript('git-pull', [`--branch=${inputs.branch}`, `--remote=${inputs.remote}`], cb)
  },
  function (cb) {
    // If pulling created merge conflicts or other issues, we need to bail and let a human fix it
    assertGitStatus()
    return cb()
  },
  function (cb) {
    // TODO: Add this when we figure out how to fix the npm link issues.
    // This is probably required in the case that somebody installed a new dependency in one of the packages.
    // log.hat('npm installing in all the packages')
    // return runScript('npm-install', [], cb)
    return cb()
  },
  function (cb) {
    log.hat('normalizing & bumping the version number for all packages')
    return runScript('npm-semver-inc', [`--level=${inputs.semverBumpLevel}`], cb)
  },
  function (cb) {
    log.hat('creating distribution builds of our player and adapters')
    cp.execSync('npm run dist:dom', { cwd: interpreterPath, stdio: 'inherit' })
    cp.execSync('npm run dist:react', { cwd: interpreterPath, stdio: 'inherit' })
    fse.copySync(path.join(interpreterPath, 'dom.bundle.js'), path.join(haikuNpmPath, 'at-haiku-player', 'dom', 'index.js'))
    fse.copySync(path.join(interpreterPath, 'react.bundle.js'), path.join(haikuNpmPath, 'at-haiku-player', 'dom', 'react.js'))
    cb()
  },
  function (cb) {
    log.hat('adding and committing all changes in all the packages')
    return runScript('git-ac', [`--message=${JSON.stringify(inputs.commitMessage)}`], cb)
  },
  function (cb) {
    log.hat('normalizing the npm version number (git sha) for all internal dependencies')
    return runScript('sha-norm', [`--branch=${inputs.branch}`, `--remote=${inputs.remote}`], cb)
  },
  function (cb) {
    log.hat('pushing changes to the git repos for all packages')
    return runScript('git-push', [`--branch=${inputs.branch}`, `--remote=${inputs.remote}`], cb)
  },
  function (cb) {
    if (inputs.doPushToNpmRegistry) {
      log.hat('publishing @haiku/player to the npm registry')
      cp.execSync('npm publish --access public', { cwd: path.join(haikuNpmPath, 'at-haiku-player'), stdio: 'inherit' })
      return cb()
    } else {
      log.log('skipping npm publish step because you said so')
      return cb()
    }
  },
  function (cb) {
    if (inputs.doUpdateChangelog) {
      return runScript('changelog', [], cb)
    } else {
      log.log('skipping changelog update because you said so')
      return cb()
    }
  },
  function (cb) {
    log.hat('finishing up by doing some git cleanup inside mono itself')
    try {
      cp.execSync('git add --all .', { cwd: ROOT, stdio: 'inherit' })
      cp.execSync('git commit -m ' + JSON.stringify(inputs.finalUberCommitMessage), { cwd: ROOT, stdio: 'inherit' })

      // QUESTION: It seems like we probably want to use these strategies but I'm not sure...
      cp.execSync('git pull -s recursive -X ours ' + inputs.remote + ' ' + inputs.branch, { cwd: ROOT, stdio: 'inherit' })

      cp.execSync('git push ' + inputs.remote + ' HEAD:' + inputs.branch, { cwd: ROOT, stdio: 'inherit' })
      return cb()
    } catch (exception) {
      log.log('there was error doing git cleanup inside mono itself. please fix issues, commit, and push mono manually')
      return cb()
    }
  }
], function (err) {
  if (err) throw err
  log.hat('finished!', 'green')
})
