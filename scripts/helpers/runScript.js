var cp = require('child_process')
var path = require('path')
var ROOT = path.join(__dirname, '..', '..')

module.exports = function runScript (name, args, cb) {
  var child = cp.fork(path.join(__dirname, '..', name + '.js'), args || [], { stdio: 'inherit', cwd: ROOT })
  child.on('close', function (code) {
    if (code !== 0) return cb(new Error('Error in ' + name))
    return cb()
  })
}
