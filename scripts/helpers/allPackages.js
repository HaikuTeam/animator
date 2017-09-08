var fse = require('fs-extra')
var path = require('path')
var cp = require('child_process')
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
  'haiku-creator': 'git@github.com:HaikuTeam/creator.git',
  'haiku-creator-electron': 'git@github.com:HaikuTeam/creator.git', // dupe hack
  'haiku-glass': 'git@github.com:HaikuTeam/glass.git',
  'haiku-player': 'git@github.com:HaikuTeam/player.git',
  'haiku-plumbing': 'git@github.com:HaikuTeam/plumbing.git',
  'haiku-sdk-client': 'git@github.com:HaikuTeam/sdk-client.git',
  'haiku-sdk-creator': 'git@github.com:HaikuTeam/sdk-creator.git',
  'haiku-sdk-inkstone': 'git@github.com:HaikuTeam/sdk-inkstone.git',
  'haiku-serialization': 'git@github.com:HaikuTeam/serialization.git',
  'haiku-state-object': 'git@github.com:HaikuTeam/StateObject.git',
  'haiku-timeline': 'git@github.com:HaikuTeam/timeline.git',
  'haiku-websockets': 'git@github.com:HaikuTeam/websockets.git'
}

module.exports = function allPackages () {
  var names = fse.readdirSync(path.join(ROOT, 'packages'))
  names = names.filter(function (name) {
    if (name[0] === '.') return false
    var abspath = path.join(ROOT, 'packages', name)
    if (!fse.lstatSync(abspath).isDirectory()) return false
    return true
  })
  var packages = names.map(function (name) {
    var abspath = path.join(ROOT, 'packages', name)
    var pkg = req(path.join(abspath, 'package.json')) || {}
    var version = pkg.version
    var sha = cp.execSync('git rev-parse HEAD', { cwd: abspath }).toString().trim()
    var remote = remotes[name]
    return {
      name: name,
      abspath: abspath,
      relpath: path.join('packages', name),
      shortname: name.replace('haiku-', ''),
      pkg: pkg,
      pkgname: pkg.name,
      version: version,
      sha: sha,
      remote: remote
    }
  })
  return packages
}
