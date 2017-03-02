var lodash = require('lodash')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

lodash.forEach(allPackages, function (pack) {
  if (pack.name === 'haiku-creator') {
    log.log('SKIPPING npm install for haiku-creator due to maxBuffer issue #FIXME\n')
    return null
  }

  if (pack.name === 'haiku-plumbing') {
    log.log('SKIPPING npm install for haiku-plumbing due to maxBuffer issue #FIXME\n')
    return null
  }

  log.log('npm install for ' + pack.name)
  cp.execSync('npm install', { cwd: pack.abspath })

  // special snowflake...
  if (pack.name === 'haiku-plumbing') {
    log.log('compiling javascript for ' + pack.name)
    return cp.execSync('npm run compile', { cwd: pack.abspath })
  }
})
