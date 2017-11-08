const async = require('async')
const cp = require('child_process')
const lodash = require('lodash')

const allPackages = require('./allPackages')()
const log = require('./log')

const allDeps = lodash.map(allPackages, (pack) => pack.pkgname)

module.exports = {
  linkAllPackages: function linkPackages (cb) {
    async.each(allPackages, function (pack, next) {
      log.log('yarn linking ' + pack.name)
      cp.exec('yarn link', { cwd: pack.abspath, stdio: 'inherit' }, next)
    }, function (err) {
      if (err) {
        throw err
      }

      cb()
    })
  },
  linkDeps: function linkDeps (packages, cb) {
    async.each(packages, function (pack, next) {
      if (!pack.pkg) {
        next()
        return
      }

      const depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
      async.each(allDeps, (depName, next) => {
        async.each(depTypes, (depType, nextDepType) => {
          if (!pack.pkg[depType] || !pack.pkg[depType][depName]) {
            nextDepType()
            return
          }

          log.log('yarn linking ' + depName + ' into project ' + pack.name)
          cp.exec('yarn link ' + depName, {cwd: pack.abspath, stdio: 'inherit'}, nextDepType)
        }, next)
      }, next)
    }, function (err) {
      if (err) {
        throw err
      }

      cb()
    })
  }
}
