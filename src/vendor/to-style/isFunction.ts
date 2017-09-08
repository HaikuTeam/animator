let objectToString = Object.prototype.toString

module.exports = function(v) {
  return objectToString.apply(v) === "[object Function]"
}
