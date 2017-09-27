var lodash = require('lodash')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var DEP_TYPES = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies'
]

lodash.forEach(allPackages, function (pack) {
  log.log('yarn upgrade for ' + pack.name)

  DEP_TYPES.forEach((type) => {
    if (pack.pkg && pack.pkg[type]) {
      lodash.forEach(pack.pkg[type], (val, key) => {
        var haiku = key.slice(0, 6)
        if (haiku === 'haiku-' || haiku === '@haiku') {
          cp.execSync(`yarn upgrade ${key} --latest --ignore-engines --non-interactive --mutex file:/tmp/.yarn-mutex --network-concurrency 1`, { cwd: pack.abspath, stdio: 'inherit' })
        }
      })
    }
  })
})
