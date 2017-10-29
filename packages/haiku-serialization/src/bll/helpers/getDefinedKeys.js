var lodash = require('lodash')

module.exports = function getDefinedKeys (obj) {
  var fullKeys = Object.keys(obj)
  return lodash.filter(fullKeys, (key) => {
    return obj[key]
  })
}
