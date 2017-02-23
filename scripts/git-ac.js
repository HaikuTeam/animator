var async = require('async')
var cp = require('child_process')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var message = argv.message

if (!message) {
  log.err('please supply a commit message ($ npm run mono:git-ac -- --message="foo")')
  process.exit(1)
}

async.eachSeries(allPackages, function (pack, next) {
  log.log('git adding & committing in ' + pack.name + ' (message: ' + message + ')')
  try {
    cp.execSync('git add --all .', { cwd: pack.abspath })
    cp.execSync('git commit -m "' + message + '"', { cwd: pack.abspath })
  } catch (exception) {
    log.log(exception.message)
  }
  return next()
})
