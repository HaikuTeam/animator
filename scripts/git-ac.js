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
    cp.execSync('git add --all .', { cwd: pack.abspath, stdio: 'inherit' })
    var status = cp.execSync('git status', { cwd: pack.abspath }).toString()
    if (status.match(/nothing to commit/)) {
      log.log('nothing to commit in ' + pack.name + '; continuing...')
    } else {
      cp.execSync('git commit -m ' + JSON.stringify(message), { cwd: pack.abspath, stdio: 'inherit' })
    }
  } catch (exception) {
    log.err(exception.message)
    return next(exception)
  }
  return next()
})
