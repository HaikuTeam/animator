var fse = require('fs-extra')
var path = require('path')
var lodash = require('lodash')
var cp = require('child_process')
// var argv = require('yargs').argv
var DepGraph = require('dependency-graph').DepGraph
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var groups = lodash.keyBy(allPackages, 'name')
var graph = new DepGraph()
// var remote = argv.remote || 'origin'
// var branch = argv.branch || 'master'

allPackages.forEach(function (pack) {
  graph.addNode(pack.pkgname, pack)
})

log.log('# gathering dependencies')

var nameToPkname = {}
var pkgnameToName = {}

allPackages.forEach(function (pack) {
  if (!pack.pkg) return void (0)

  nameToPkname[pack.name] = pack.pkgname
  pkgnameToName[pack.pkgname] = pack.name

  var depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']

  depTypes.forEach((depType) => {
    if (pack.pkg[depType]) {
      for (var depName in pack.pkg[depType]) {
        // A few hacks...
        if (depName.slice(0, 6) !== 'haiku-' && depName.slice(0, 13) !== '@haiku/player') {
          continue
        }

        // special snowflake #1
        if (depName === 'haiku-fs-extra') continue

        log.log(pack.pkgname + ' depends on ' + depName)

        graph.addDependency(pack.pkgname, depName)
      }
    }
  })
})

var order = graph.overallOrder()

log.log('# overall order:')
log.log(order)
log.log(JSON.stringify(nameToPkname))
log.log('# updating dependencies')

order.forEach(function (pkgname) {
  var pack = groups[pkgnameToName[pkgname]]

  var deps = graph.dependenciesOf(pkgname)

  if (deps.length < 1) return void (0)

  log.log(pack.pkgname + ' wants ' + JSON.stringify(deps))

  var didAnythingChange = false

  var changedDeps = {}

  for (var i = 0; i < deps.length; i++) {
    var depPkgname = deps[i]
    var depName = pkgnameToName[depPkgname]

    var depPack = groups[depName]
    var depSha = depPack.sha
    var depRemote = depPack.remote
    var depUrl = depRemote + '#' + depSha

    var depTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
    depTypes.forEach((depType) => {
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
    log.log('saving and committing ' + pack.pkgname)
    var commitMsg = 'chore: Updated dependency SHAs for ' + Object.keys(changedDeps).join(', ')
    log.log('commit: ' + commitMsg)
    var packJson = JSON.stringify(pack.pkg, null, 2) + '\n'

    fse.writeFileSync(path.join(pack.abspath, 'package.json'), packJson)
    log.log(cp.execSync('git add package.json', { cwd: pack.abspath }))

    // build and commit haiku-sdk, since it will be affected by dep changes
    // should fix phantom SDK changes issue
    // should work?  but untested, so leaving commented for now - ZB
    // if(pack.pkgname === 'haiku-sdk'){
    //   log.log(cp.execSync('npm i', { cwd: pack.abspath }))
    //   log.log(cp.execSync('npm run compile', { cwd: pack.abspath }))
    //   log.log(cp.execSync('git add ./lib', { cwd: pack.abspath }))
    // }

    log.log(cp.execSync('git commit -m "' + commitMsg + '"', { cwd: pack.abspath }))

    // QUESTION:
    // Maybe it doesn't make sense to push on this step, since we almost always run git-push after?
    // // Skip push with npm run mono:sha-norm -- --noPush
    // if (!argv.noPush) {
    //   log.log(cp.execSync('git push ' + remote + ' HEAD:' + branch, { cwd: pack.abspath }))
    // }

    pack.sha = cp.execSync('git rev-parse HEAD', { cwd: pack.abspath }).toString().trim()
    log.log('sha of ' + pack.pkgname + ' is now ' + pack.sha)
  } else {
    log.log('no changes for ' + pack.pkgname)
  }
})
