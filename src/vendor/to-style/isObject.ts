let objectToString = Object.prototype.toString

module.exports = function(v) {
  return !!v && objectToString.call(v) === "[object Object]"
}
