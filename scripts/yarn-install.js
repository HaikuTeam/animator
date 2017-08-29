var lodash = require('lodash')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var EXEC_OPTIONS = {
  maxBuffer: 1024 * 1024 // bytes
}

lodash.forEach(allPackages, function (pack) {
  log.log('yarn install for ' + pack.name)

  cp.execSync('yarn install --ignore-engines --non-interactive', lodash.merge(EXEC_OPTIONS, { cwd: pack.abspath, stdio: 'inherit' }))

  // special snowflake...
  if (pack.name === 'haiku-plumbing') {
    log.log('compiling javascript for ' + pack.name)
    return cp.execSync('yarn run compile', lodash.merge(EXEC_OPTIONS, { cwd: pack.abspath, stdio: 'inherit' }))
  }
})
