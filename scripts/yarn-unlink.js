var async = require('async')
var lodash = require('lodash')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var groups = lodash.keyBy(allPackages, 'name')

log.hat(`it is ok if any 'yarn unlink' step fails with 'no registered module'`)

async.eachSeries(allPackages, function (pack, next) {
  if (!pack.pkg) {
    return next()
  }

  var depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
  depTypes.forEach((depType) => {
    if (!pack.pkg[depType]) return

    for (var depName in groups) {
      if (pack.pkg[depType][depName]) {
        log.log('yarn unlinking ' + depName + ' from project ' + pack.name)
        try {
          cp.execSync('yarn unlink ' + depName, { cwd: pack.abspath })
        } catch (exception) {
          // empty
        }
      }
    }
  })

  return next()
}, function () {
  async.eachSeries(allPackages, function (pack, next) {
    log.log('yarn unlinking ' + pack.name)
    try {
      cp.execSync('yarn unlink', { cwd: pack.abspath })
    } catch (exception) {
      // empty
    }
    next()
  })
})
