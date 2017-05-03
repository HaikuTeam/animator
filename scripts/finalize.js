var lodash = require('lodash')
var fse = require('fs-extra')
var cp = require('child_process')
var path = require('path')
var argv = require('yargs').argv
var semver = require('semver')
var async = require('async')
var log = require('./helpers/log')
var runScript = require('./helpers/runScript')
var allPackages = require('./helpers/allPackages')()
var groups = lodash.keyBy(allPackages, 'name')
var interpreterPath = groups['haiku-interpreter'].abspath
var haikuNpmPath = groups['haiku-npm'].abspath
var ROOT = path.join(__dirname, '..')

/**
 * Run this script when you're done making changes and want to push your code.
 * Caution: This makes commits, pushes to the remote repos, and publishes the
 * latest player version to the npm registry.
 */

log.log('finalizing changes')

async.series([
  function (cb) {
    return runScript('git-pull', [], cb)
  },
  function (cb) {
    return runScript('npm-semver-inc', ['--level=patch'], cb)
  },
  function (cb) {
    log.log('creating public framework builds')
    cp.execSync('npm run dist:dom', { cwd: interpreterPath, stdio: 'inherit' })
    cp.execSync('npm run dist:react', { cwd: interpreterPath, stdio: 'inherit' })
    log.log('moving public framework builds into haiku.ai')
    fse.copySync(path.join(interpreterPath, 'dom.bundle.js'), path.join(haikuNpmPath, 'haiku.ai', 'player', 'dom', 'index.js'))
    fse.copySync(path.join(interpreterPath, 'react.bundle.js'), path.join(haikuNpmPath, 'haiku.ai', 'player', 'dom', 'react.js'))
    cb()
  },
  function (cb) {
    return runScript('git-ac', ['--message="auto: Housekeeping"'], cb)
  },
  function (cb) {
    return runScript('sha-norm', [], cb)
  },
  function (cb) {
    return runScript('git-push', [], cb)
  },
  function (cb) {
    log.log('publishing haiku.ai to the npm registry')
    cp.execSync('npm publish', { cwd: path.join(haikuNpmPath, 'haiku.ai'), stdio: 'inherit' })
    cb()
  },
  function (cb) {
    cp.execSync('git add --all .', { cwd: ROOT, stdio: 'inherit' })
    cp.execSync('git commit -m "auto: Housekeeping"', { cwd: ROOT, stdio: 'inherit' })
    cp.execSync('git pull origin HEAD:master', { cwd: ROOT, stdio: 'inherit' })
    cp.execSync('git push origin HEAD:master', { cwd: ROOT, stdio: 'inherit' })
    cb()
  }
], function (err) {
  if (err) throw err
  log.log('finalized!')
})
