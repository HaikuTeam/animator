var path = require('path')
var log = require('./log')
var gitStatusInfo = require('./gitStatusInfo')
var ROOT = path.join(__dirname, '..', '..')

module.exports = function assertGitStatus () {
  var _statusInfo = gitStatusInfo(ROOT)

  if (_statusInfo.submoduleHasUntrackedContent) {
    log.err('you have untracked content. add and commit (or discard) those changes first, then try this again.\n')
    process.exit(1)
  } else if (_statusInfo.submoduleHasModifiedContent) {
    log.err('you\'ve modified content but not committed it. commit (or discard) those changes first, then try this again.\n')
    process.exit(1)
  } else if (_statusInfo.submoduleHasUnmergedPaths) {
    log.err('you have merge conflicts. fix those conflicts first, then try this again.\n')
    process.exit(1)
  }
}
