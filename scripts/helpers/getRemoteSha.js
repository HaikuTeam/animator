var path = require('path')
var cp = require('child_process')
var ROOT = path.join(__dirname, '..', '..')
var SHA_LEN = 40

module.exports = function getRemoteSha (remote) {
  var lines = cp.execSync(`git ls-remote ${remote}`, { cwd: ROOT }).toString().trim().split('\n')
  return lines[0].slice(0, SHA_LEN)
}
