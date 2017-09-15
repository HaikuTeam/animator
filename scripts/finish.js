var lodash = require('lodash')
var fse = require('fs-extra')
var fs = require('fs')
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
var playerPath = groups['haiku-player'].abspath
var ROOT = path.join(__dirname, '..')

var initializeAWSService = require('./../distro/scripts/initializeAWSService')
var uploadObjectToS3 = require('./../distro/scripts/uploadObjectToS3')
var DEPLOY_CONFIGS = require('./../distro/deploy')

/**
 * Run this script when you're done making changes and want to push your code.
 */

var inputs = lodash.assign({}, argv)
delete inputs._
delete inputs.$0
var _branch = cp.execSync('git symbolic-ref --short -q HEAD').toString().trim()
log.log(`fyi, your current mono branch is ${JSON.stringify(_branch)}\n`)
if (!inputs.branch) inputs.branch = _branch

function uploadFileStream (sourcepath, destpath, region, deployer, env, bucket, acl, cb) {
  var config = DEPLOY_CONFIGS[deployer][env]

  if (!config) {
    throw new Error(`No config for ${deployer} / ${env}`)
  }

  var accessKeyId = config.key
  var secretAccessKey = config.secret

  var s3 = initializeAWSService('S3', region, accessKeyId, secretAccessKey)
  var stream = fs.createReadStream(sourcepath)

  console.log('uploading ' + sourcepath + ' as ' + destpath + ' to ' + bucket + '...')

  return uploadObjectToS3(s3, destpath, stream, bucket, acl, cb)
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

function nowVersion () {
  return fse.readJsonSync(path.join(ROOT, 'package.json')).version
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
        type: 'confirm',
        name: 'doLintPackages',
        message: 'Run the linter in all the packages? (warning: this may auto-format your code, resulting in unsaved changes)',
        default: false
      },
      {
        type: 'confirm',
        name: 'doTestPackages',
        message: 'Run automated tests in all the packages? (note: failed tests will _not_ block the rest of the steps)',
        default: false
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
      },
      {
        type: 'confirm',
        name: 'doDistro',
        message: 'Build distro (build Haiku.app, push to release channel etc.)?:',
        default: false // More often than not, we just want to push code, not release
      }
    ]).then(function (answers) {
      lodash.assign(inputs, answers)
      log.log(`finish inputs were: ${JSON.stringify(inputs, null, 2)}`)
      inquirer.prompt([
        {
          type: 'confirm',
          name: 'doProceed',
          message: 'ok to proceed with "finish"?',
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
    log.hat('fetching & merging all subtrees')
    return runScript('git-subtree-pull', [`--branch=${inputs.branch}`, `--remote=${inputs.remote}`], cb)
  },

  function (cb) {
    // If pulling created merge conflicts or other issues, we need to bail and let a human fix it
    assertGitStatus()
    return cb()
  },

  function (cb) {
    return runScript('semver', [], cb)
  },

  function (cb) {
    log.hat(`note that the current version is ${nowVersion()}`)

    log.hat('creating distribution builds of our player and adapters')

    // Clear out the dist folder
    fse.removeSync(path.join(playerPath, 'dist'))
    fse.mkdirpSync(path.join(playerPath, 'dist'))

    // Compile Typescript to Javascript just to be sure
    cp.execSync('yarn run compile', { cwd: playerPath, stdio: 'inherit' })

    var playerPackageJson = require('./../packages/haiku-player/package.json')
    var reactVersion = playerPackageJson.peerDependencies.react
    cp.execSync(`yarn add react@${reactVersion}`, { cwd: playerPath, stdio: 'inherit' })

    log.log('browserifying player packages and adapters')
    cp.execSync(`browserify ${JSON.stringify(path.join(playerPath, 'lib', 'adapters', 'dom', 'index.js'))} --standalone HaikuDOMPlayer | derequire > ${JSON.stringify(path.join(playerPath, 'dist', 'dom.bundle.js'))}`, { stdio: 'inherit' })
    cp.execSync(`browserify ${JSON.stringify(path.join(playerPath, 'lib', 'adapters', 'react-dom', 'index.js'))} --standalone HaikuReactAdapter --external react --external react-test-renderer --external lodash.merge | derequire > ${JSON.stringify(path.join(playerPath, 'dist', 'react-dom.bundle.js'))} && sed -i '' -E -e "s/_dereq_[(]'(react|react-test-renderer|lodash\\.merge)'[)]/require('\\1')/g" ${JSON.stringify(path.join(playerPath, 'dist', 'react-dom.bundle.js'))}`, { stdio: 'inherit' })

    log.log('creating minified bundles for the cdn')
    cp.execSync(`uglifyjs ${JSON.stringify(path.join(playerPath, 'dist', 'dom.bundle.js'))} --compress --mangle --output ${JSON.stringify(path.join(playerPath, 'dist', 'dom.bundle.min.js'))}`)
    cp.execSync(`uglifyjs ${JSON.stringify(path.join(playerPath, 'dist', 'react-dom.bundle.js'))} --compress --mangle --output ${JSON.stringify(path.join(playerPath, 'dist', 'react-dom.bundle.min.js'))}`)

    // Note: These are hosted via the haiku-internal AWS account
    // https://code.haiku.ai/scripts/player/HaikuPlayer.${vers}.js
    // https://code.haiku.ai/scripts/player/HaikuPlayer.${vers}.min.js
    //
    // I was asking myself if we wanted to include a string like `staging` in these paths to differentiate
    // builds we do from staging from prod, but my current thought is that that isn't necessary since
    // the version we push will always be _ahead_ of the version userland is on, and someone would have
    // to manually change the snippet to get an advance/untested version

    log.log('uploading bundles to the cdn')

    return async.series([
      function (cb) {
        // Note that the object keys should NOT begin with a slash, or the S3 path will get weird
        log.log('uploading dom bundle to code.haiku.ai')
        return uploadFileStream(path.join(playerPath, 'dist', 'dom.bundle.js'), `scripts/player/HaikuPlayer.${nowVersion()}.js`, 'us-east-1', 'code.haiku.ai', 'production', 'code.haiku.ai', 'public-read', cb)
      },
      function (cb) {
        log.log('uploading dom bundle to code.haiku.ai (as "latest")')
        return uploadFileStream(path.join(playerPath, 'dist', 'dom.bundle.js'), `scripts/player/HaikuPlayer.latest.js`, 'us-east-1', 'code.haiku.ai', 'production', 'code.haiku.ai', 'public-read', cb)
      },
      function (cb) {
        log.log('uploading dom bundle to code.haiku.ai (minified)')
        return uploadFileStream(path.join(playerPath, 'dist', 'dom.bundle.min.js'), `scripts/player/HaikuPlayer.${nowVersion()}.min.js`, 'us-east-1', 'code.haiku.ai', 'production', 'code.haiku.ai', 'public-read', cb)
      },
      function (cb) {
        log.log('uploading dom bundle to code.haiku.ai (minified, as "latest")')
        return uploadFileStream(path.join(playerPath, 'dist', 'dom.bundle.min.js'), `scripts/player/HaikuPlayer.latest.min.js`, 'us-east-1', 'code.haiku.ai', 'production', 'code.haiku.ai', 'public-read', cb)
      },
      function (cb) {
        log.hat(`
          our provided 3rd-party scripts:
          https://code.haiku.ai/scripts/player/HaikuPlayer.${nowVersion()}.js
          https://code.haiku.ai/scripts/player/HaikuPlayer.${nowVersion()}.min.js

          and for convenience:
          https://code.haiku.ai/scripts/player/HaikuPlayer.latest.js
          https://code.haiku.ai/scripts/player/HaikuPlayer.latest.min.js
          ^^ you probably need to invalidate cloudfront for the "latest" files to update ^^
        `)
        return cb()
      }
    ], cb)
  },

  function (cb) {
    log.hat('adding and committing all changes')
    cp.execSync('git add --all .', { cwd: ROOT, stdio: 'inherit' })
    cp.execSync(`git commit -m "auto: ${inputs.commitMessage}"`, { cwd: ROOT, stdio: 'inherit' })
    return cb()
  },

  function (cb) {
    log.hat('pushing changes to all git subtrees')
    return runScript('git-subtree-push', [`--branch=${inputs.branch}`, `--remote=${inputs.remote}`], cb)
  },

  function (cb) {
    log.hat('publishing @haiku/player to the npm registry')
    // cp.execSync(`yarn publish --verbose --new-version ${nowVersion()} --access public`, { cwd: path.join(playerPath), stdio: 'inherit' })
    process.env.npm_config_registry = 'https://registry.npmjs.org'
    cp.execSync(`npm publish --verbose --access public`, { cwd: path.join(playerPath), stdio: 'inherit' })
    return cb()
  },

  function (cb) {
    return runScript('changelog', [], cb)
  },

  function (cb) {
    log.hat('finishing up by doing some git cleanup inside mono itself')
    try {
      cp.execSync('git add --all .', { cwd: ROOT, stdio: 'inherit' })
      cp.execSync('git commit -m ' + JSON.stringify(inputs.finalUberCommitMessage), { cwd: ROOT, stdio: 'inherit' })
      cp.execSync('git push ' + inputs.remote + ' HEAD:' + inputs.branch, { cwd: ROOT, stdio: 'inherit' })
      return cb()
    } catch (exception) {
      log.log('there was error doing git cleanup inside mono itself. please fix issues, commit, and push mono manually')
      return cb()
    }
  },

  function (cb) {
    if (inputs.doDistro) {
      log.hat('starting interactive distro build process')
      return runScript('distro', [`--version=${nowVersion()}`], (err) => {
        if (err) return cb(err)
        cp.execSync('git add --all .', { cwd: ROOT, stdio: 'inherit' })
        cp.execSync(`git commit -m "auto: Built release"`, { cwd: ROOT, stdio: 'inherit' })
        return cb()
      })
    }
    log.log('skipping distro because you said so')
    return cb()
  }
], function (err) {
  if (err) throw err
  log.hat(`finished! current version is ${nowVersion()}`, 'green')
})
