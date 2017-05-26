var lodash = require('lodash')
var cp = require('child_process')
var log = require('./helpers/log')
var runScript = require('./helpers/runScript')
var allPackages = require('./helpers/allPackages')()

lodash.forEach(allPackages, function (pack) {
  log.log('cleaning out npm stuff for ' + pack.name)

  cp.execSync('rm -rf node_modules', { cwd: pack.abspath })

  cp.execSync('npm cache clean', { cwd: pack.abspath })
})

runScript('npm-link', [], function (err) {
  if (err) throw err

  runScript('npm-install', [], function (err) {
    if (err) throw err
  })
})
