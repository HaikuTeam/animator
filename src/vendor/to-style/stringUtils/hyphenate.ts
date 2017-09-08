let separate = require("./separate")

module.exports = function(name) {
  return separate(name).toLowerCase()
}
