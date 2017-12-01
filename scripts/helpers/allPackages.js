var fse = require('fs-extra')
var path = require('path')
// var getRemoteSha = require('./getRemoteSha')
var ROOT = path.join(__dirname, '..', '..')

function req (mod) {
  try {
    return require(mod)
  } catch (exception) {
    return null
  }
}

var remotes = {
  'haiku-bytecode': 'git@github.com:HaikuTeam/bytecode.git',
  'haiku-cli': 'git@github.com:HaikuTeam/cli.git',
  'haiku-common': 'git@github.com:HaikuTeam/common.git',
  'haiku-creator': 'git@github.com:HaikuTeam/creator.git',
  'haiku-creator-electron': 'git@github.com:HaikuTeam/creator.git', // dupe hack
  'haiku-formats': 'git@github.com:HaikuTeam/formats.git',
  'haiku-glass': 'git@github.com:HaikuTeam/glass.git',
  'haiku-player': 'git@github.com:HaikuTeam/player.git',
  'haiku-plumbing': 'git@github.com:HaikuTeam/plumbing.git',
  'haiku-sdk-client': 'git@github.com:HaikuTeam/sdk-client.git',
  'haiku-sdk-creator': 'git@github.com:HaikuTeam/sdk-creator.git',
  'haiku-sdk-inkstone': 'git@github.com:HaikuTeam/sdk-inkstone.git',
  'haiku-serialization': 'git@github.com:HaikuTeam/serialization.git',
  'haiku-state-object': 'git@github.com:HaikuTeam/StateObject.git',
  'haiku-testing': 'git@github.com:HaikuTeam/testing.git',
  'haiku-timeline': 'git@github.com:HaikuTeam/timeline.git',
  'haiku-ui-common': 'git@github.com:HaikuTeam/ui-common.git',
  'haiku-websockets': 'git@github.com:HaikuTeam/websockets.git'
}

// Ordered roughly from fewest deps to most, in order to avoid
// Typescript issues when compiling projects with compiled deps
var order = require('./CompileOrder')

module.exports = function allPackages (names) {
  if (names) {
    if (!Array.isArray(names)) {
      names = [names]
    }
  } else {
    names = fse.readdirSync(path.join(ROOT, 'packages')).filter(function (name) {
      if (name[0] === '.') return false
      var abspath = path.join(ROOT, 'packages', name)
      if (!fse.lstatSync(abspath).isDirectory()) return false
      return true
    })
  }

  var packages = []
  names.forEach(function (name) {
    var abspath = path.join(ROOT, 'packages', name)
    if (!fse.existsSync(abspath)) {
      return
    }
    var pkg = req(path.join(abspath, 'package.json')) || {}
    var version = pkg.version
    var remote = remotes[name]
    // var sha = getRemoteSha(remote)
    var obj = {
      name: name,
      abspath: abspath,
      relpath: path.join('packages', name),
      shortname: name.replace('haiku-', ''),
      pkg: pkg,
      pkgname: pkg.name,
      version: version,
      // sha: sha,
      remote: remote
    }
    packages.push(obj)
  })
  packages.sort((a, b) => {
    return order.indexOf(a.name) - order.indexOf(b.name)
  })
  return packages
}
