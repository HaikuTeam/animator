var cp = require('child_process')

function directoryCommand (directory, command, cb) {
  console.log('executing `' + command + '` in ' + directory)
  return cp.exec(command, { cwd: directory }, function (err, out) {
    if (err) return cb(err)
    if (out) console.log('->', out.toString())
    return cb()
  })
}

module.exports = directoryCommand
