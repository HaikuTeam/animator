var cp = require('child_process')
var path = require('path')
var async = require('async')
var log = require('./helpers/log')
var runScript = require('./helpers/runScript')
var ROOT = path.join(__dirname, '..')

/**
 * Run this script when you're done making changes and want to push your code.
 * A more complete version of this is 'finalize' which. But this works for day-to-day dev.
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
    return runScript('git-ac', ['--message="auto: Housekeeping"'], cb)
  },
  function (cb) {
    return runScript('sha-norm', [], cb)
  },
  function (cb) {
    return runScript('git-push', [], cb)
  },
  function (cb) {
    cp.execSync('git add --all .', { cwd: ROOT, stdio: 'inherit' })
    cp.execSync('git commit -m "auto: Housekeeping"', { cwd: ROOT, stdio: 'inherit' })
    cp.execSync('git pull', { cwd: ROOT, stdio: 'inherit' })
    cp.execSync('git push origin HEAD:master', { cwd: ROOT, stdio: 'inherit' })
    cb()
  }
], function (err) {
  if (err) throw err
  log.log('finalized!')
})
