function invalidateModule (path) {
  var fn = require
  delete fn.cache[path]
  delete fn.cache[fn.resolve(path)]
}

module.exports = invalidateModule
