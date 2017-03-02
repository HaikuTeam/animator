var async = require('async')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

async.eachSeries(allPackages, function (pack, next) {
  if (pack.name === 'haiku-creator') {
    log.log('SKIPPPING npm install for haiku-creator due to maxBuffer issue #FIXME\n')
    return next()
  }

  if (pack.name === 'haiku-plumbing') {
    log.log('SKIPPPING npm install for haiku-plumbing due to maxBuffer issue #FIXME\n')
    return next()
  }

  log.log('npm install for ' + pack.name)
  cp.exec('npm install', { cwd: pack.abspath }, function (err, out) {
    if (err) {
      log.err(err)
      return next(err)
    }
    log.log(out)

    // special snowflake...
    if (pack.name === 'haiku-plumbing') {
      log.log('updating git submodules for ' + pack.name)
      return cp.exec('git submodule update --init --recursive', { cwd: pack.abspath }, function (err, out) {
        if (err) {
          log.err(err)
          return next(err)
        }
        log.log(out)
        log.log('compiling javascript for ' + pack.name)
        return cp.exec('npm run compile', { cwd: pack.abspath }, function (err, out) {
          if (err) {
            log.err(err)
            return next(err)
          }
          log.log(out)
          return next()
        })
      })
    }

    return next()
  })
})
