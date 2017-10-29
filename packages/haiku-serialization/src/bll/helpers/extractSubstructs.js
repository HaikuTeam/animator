const _findSubstructs = require('./findSubstructs')

module.exports = function _extractSubstructs (ast, relpath, cb) {
  let substructs
  try {
    substructs = _findSubstructs(ast, relpath)
  } catch (exception) {
    return cb(exception)
  }
  return cb(null, substructs)
}
