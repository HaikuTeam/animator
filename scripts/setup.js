var lodash = require('lodash')
var cp = require('child_process')
var log = require('./helpers/log')
var runScript = require('./helpers/runScript')
var allPackages = require('./helpers/allPackages')()

// lodash.forEach(allPackages, function (pack) {
//   log.log('cleaning out npm/yarn stuff for ' + pack.name)
//   cp.execSync('rm -rf node_modules', { cwd: pack.abspath })
// })

runScript('yarn-unlink', [], function (err) {
  if (err) throw err
  runScript('yarn-link', [], function (err) {
    if (err) throw err
    runScript('yarn-install', [], function (err) {
      if (err) throw err
    })
  })
})
