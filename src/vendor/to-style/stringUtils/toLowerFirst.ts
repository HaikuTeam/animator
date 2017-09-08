module.exports = function(value) {
  return value.length
    ? value.charAt(0).toLowerCase() + value.substring(1)
    : value
}
