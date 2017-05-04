var lodash = require('lodash')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var EXEC_OPTIONS = {
  maxBuffer: 1024 * 1024 // bytes
}

lodash.forEach(allPackages, function (pack) {
  log.log('npm install for ' + pack.name)
  cp.execSync('npm install', lodash.merge(EXEC_OPTIONS, { cwd: pack.abspath }))

  // special snowflake...
  if (pack.name === 'haiku-plumbing') {
    log.log('compiling javascript for ' + pack.name)
    return cp.execSync('npm run compile', lodash.merge(EXEC_OPTIONS, { cwd: pack.abspath }))
  }
})
