var async = require('async')
var cp = require('child_process')
var argv = require('yargs').argv
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var args = argv._
var cmd = args[0]

async.eachSeries(allPackages, function (pack, next) {
  log('running command ' + cmd + ' in ' + pack.abspath)
  cp.exec(cmd, { cwd: pack.abspath }, function (err, out) {
    if (err) {
      log.err(err)
      return next(err)
    }
    log.log(out)
    return next()
  })
})
