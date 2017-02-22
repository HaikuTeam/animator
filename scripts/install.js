var async = require('async')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

async.eachSeries(allPackages, function (pack, next) {
  cp.exec('npm install --production', { cwd: pack.abspath }, function (err, out) {
    if (err) {
      log.err(err)
      return next(err)
    }
    log.log(out)
    return next()
  })
})
