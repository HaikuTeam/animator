var async = require('async')
var cp = require('child_process')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var DEFAULT_MESSAGE = 'auto: Via haiku-mono'
var message = argv.message || DEFAULT_MESSAGE

async.eachSeries(allPackages, function (pack, next) {
  log.log('git adding & committing in ' + pack.name)
  try {
    cp.execSync('git add --all .', { cwd: pack.abspath })
    cp.execSync('git commit -m "' + message + '"', { cwd: pack.abspath })
  } catch (exception) {
    log.log(exception.message)
  }
  return next()
})
