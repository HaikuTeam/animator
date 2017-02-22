var async = require('async')
var fse = require('fs-extra')
var cp = require('child_process')
var log = require('./helpers/log')
var allPackages = require('./helpers/allPackages')()

async.eachSeries(allPackages, function (sourcePack, nextSource) {
  async.eachSeries(allPackages, function (destPack, nextDest) {
    if (!destPack.pkg) return nextDest()
    if (!destPack.pkg.dependencies) return nextDest()
    if (!destPack.pkg.dependencies[sourcePack.name]) return nextDest()

    var versionToUse = sourcePack.remote + '#' + sourcePack.sha

    if (destPack.pkg.dependencies[sourcePack.name] === versionToUse) return nextDest()

    destPack.pkg.dependencies[sourcePack.name] = versionToUse
    var packageContent = JSON.stringify(destPack.pkg, null, 2) + '\n'
    fse.writeFileSync(path.join(destPack.abspath, 'package.json'), packageContent)
    log.log('set ' + destPack.name + '\'s version of ' + sourcePack.name + ' to ' + versionToUse)

    return nextDest()
  }, nextSource)
})
