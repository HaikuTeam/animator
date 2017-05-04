var fse = require('fs-extra')
var path = require('path')
var lodash = require('lodash')
var cp = require('child_process')
var argv = require('yargs').argv
var DepGraph = require('dependency-graph').DepGraph
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

var groups = lodash.keyBy(allPackages, 'name')
var graph = new DepGraph()
var origin = argv.origin || 'master'

allPackages.forEach(function (pack) {
  graph.addNode(pack.name, pack)
})

allPackages.forEach(function (pack) {
  if (!pack.pkg) return void (0)
  if (!pack.pkg.dependencies) return void (0)
  for (var depName in pack.pkg.dependencies) {
    // A few hacks...
    if (depName.slice(0, 6) !== 'haiku-') continue
    if (depName === 'haiku-fs-extra') continue
    if (depName === 'haiku-creator-electron') depName = 'haiku-creator'

    graph.addDependency(pack.name, depName)
  }
})

var order = graph.overallOrder()
order.forEach(function (name) {
  var pack = groups[name]
  var deps = graph.dependenciesOf(name)
  if (deps.length < 1) return void (0)
  log.log(pack.name + ' wants ' + JSON.stringify(deps))

  var didAnythingChange = false
  var changedDeps = []
  for (var i = 0; i < deps.length; i++) {
    var depName = deps[i]
    var depPack = groups[depName]
    var depSha = depPack.sha
    var depRemote = depPack.remote

    if (depName === 'haiku-creator') depName = 'haiku-creator-electron'
    var depUrl = depRemote + '#' + depSha

    if (pack.pkg.dependencies[depName] !== depUrl) {
      pack.pkg.dependencies[depName] = depUrl
      log.log(pack.name + ' gets ' + depUrl)
      changedDeps.push(depName)
      didAnythingChange = true
    }
  }

  if (didAnythingChange) {
    log.log('saving, committing, and pushing ' + pack.name)
    var commitMsg = 'chore: Updated dependency SHAs for ' + changedDeps.join(', ')
    log.log('commit: ' + commitMsg)
    var packJson = JSON.stringify(pack.pkg, null, 2) + '\n'

    fse.writeFileSync(path.join(pack.abspath, 'package.json'), packJson)
    log.log(cp.execSync('git add package.json', { cwd: pack.abspath }))

    // build and commit haiku-sdk, since it will be affected by dep changes
    // should fix phantom SDK changes issue
    // should work?  but untested, so leaving commented for now - ZB
    // if(pack.name === 'haiku-sdk'){
    //   log.log(cp.execSync('npm i', { cwd: pack.abspath }))
    //   log.log(cp.execSync('npm run compile', { cwd: pack.abspath }))
    //   log.log(cp.execSync('git add ./lib', { cwd: pack.abspath }))
    // }

    log.log(cp.execSync('git commit -m "' + commitMsg + '"', { cwd: pack.abspath }))

    // Skip push with npm run mono:sha-norm -- --noPush
    if (!argv.noPush) {
      log.log(cp.execSync('git push origin HEAD:' + origin, { cwd: pack.abspath }))
    }

    pack.sha = cp.execSync('git rev-parse HEAD', { cwd: pack.abspath }).toString().trim()
    log.log('sha of ' + pack.name + ' is now ' + pack.sha)
  } else {
    log.log('no changes for ' + pack.name)
  }
})
