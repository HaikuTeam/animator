var fse = require('fs-extra')
var path = require('path')
var lodash = require('lodash')
var cp = require('child_process')
var DepGraph = require('dependency-graph').DepGraph
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var DEP_TYPES = [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies'
]

var groups = lodash.keyBy(allPackages, 'name')
var graph = new DepGraph()

allPackages.forEach(function (pack) {
  graph.addNode(pack.pkgname, pack)
})

log.log('gathering dependencies')

var nameToPkname = {}
var pkgnameToName = {}

allPackages.forEach(function (pack) {
  if (!pack.pkg) return void (0)

  nameToPkname[pack.name] = pack.pkgname
  pkgnameToName[pack.pkgname] = pack.name

  DEP_TYPES.forEach((depType) => {
    if (pack.pkg[depType]) {
      for (var depName in pack.pkg[depType]) {
        // A few hacks...
        if (depName.slice(0, 6) !== 'haiku-' && depName.slice(0, 13) !== '@haiku/player') {
          continue
        }

        // special snowflake #1
        if (depName === 'haiku-fs-extra') {
          continue
        }

        log.log(pack.pkgname + ' depends on ' + depName)
        graph.addDependency(pack.pkgname, depName)
      }
    }
  })
})

var order = graph.overallOrder()

log.log('updating dependencies')

order.forEach(function (pkgname) {
  var pack = groups[pkgnameToName[pkgname]]
  var deps = graph.dependenciesOf(pkgname)

  if (deps.length < 1) {
    return void (0)
  }

  log.log(pack.pkgname + ' wants ' + JSON.stringify(deps))

  var didAnythingChange = false
  var changedDeps = {}

  for (var i = 0; i < deps.length; i++) {
    var depPkgname = deps[i]
    var depName = pkgnameToName[depPkgname]

    var depPack = groups[depName]
    var depSha = depPack.sha
    var depRemote = depPack.remote

    // Change from legacy dep format to new yarn dep format
    depRemote = depRemote.replace('git@github.com:', '')

    var depUrl = depRemote + '#' + depSha

    DEP_TYPES.forEach((depType) => {
      if (pack.pkg[depType] && pack.pkg[depType][depPkgname]) {
        if (pack.pkg[depType][depPkgname] !== depUrl) {
          pack.pkg[depType][depPkgname] = depUrl

          log.log(pack.pkgname + ' "' + depType + '"' + ' gets ' + depPkgname + ': ' + depUrl)

          changedDeps[depPkgname] = true
          didAnythingChange = true
        }
      }
    })
  }

  if (didAnythingChange) {
    var packJson = JSON.stringify(pack.pkg, null, 2) + '\n'
    log.log(packJson)
    fse.writeFileSync(path.join(pack.abspath, 'package.json'), packJson)
  } else {
    log.log('no changes for ' + pack.pkgname)
  }
})

allPackages.forEach((pack) => {
  cp.execSync(`rm yarn.lock || true`, { cwd: pack.abspath, stdio: 'inherit' })
})
