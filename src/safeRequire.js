function safeRequire (mod, cb) {
  var loaded
  try {
    loaded = require(mod)
  } catch (exception) {
    return cb(exception)
  }
  return cb(null, loaded)
}

module.exports = safeRequire
