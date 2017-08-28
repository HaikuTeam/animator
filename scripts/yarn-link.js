var async = require('async')
var cp = require('child_process')
var fs = require('fs')
var _ = require('lodash')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

async.eachSeries(allPackages, function (pack, next) {
  log.log('yarn linking ' + pack.name)
  cp.execSync('yarn link', { cwd: pack.abspath })
  next()
}, function () {
  async.eachSeries(allPackages, function (pack, next) {
    if (!pack.pkg) {
      return next()
    }

    var depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
    depTypes.forEach((depType) => {
      if (!pack.pkg[depType]) return

      var pkgJsonPath = pack.abspath + '/package.json'

      var pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))

      if (pkgJson[depType]) {
        _.forOwn(pkgJson[depType], (version, dep) => {
          _.forEach(allPackages, (innerPack) => {
            // pkgname is like haiku-bytecode or @haiku/player - whatever appears in package.json
            if (dep === innerPack.pkgname) {
              log.log('yarn linking ' + dep + ' into project ' + pack.name)
              cp.execSync('yarn link ' + dep, { cwd: pack.abspath })
            }
          })
        })
      }
    })

    next()
  })
})
