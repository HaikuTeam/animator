var async = require('async')
var cp = require('child_process')
var path = require('path')
var log = require('./helpers/log')
var gitStatusInfo = require('./helpers/gitStatusInfo')
var allPackages = require('./helpers/allPackages')()
var ROOT = path.join(__dirname, '..')

async.eachSeries(allPackages, function (pack, next) {
  if (pack.pkg.scripts && pack.pkg.scripts.test) {
    if (pack.pkg.scripts.test !== `echo "Error: no test specified" && exit 1`) {
      try {
        log.log('running tests in ' + pack.name)
        cp.execSync('yarn run test', { cwd: pack.abspath, stdio: 'inherit' })
      } catch (exception) {
        log.err(exception.message)
      }
    }
  }
  return next()
}, () => {
  var monoStatus = gitStatusInfo(ROOT)
  delete monoStatus.output
  var statStr = JSON.stringify(monoStatus, null, 2)
  log.hat(`Here's what things look like in mono now:\n${statStr}\n(This is just FYI. An empty object is ok too.)`)
})
