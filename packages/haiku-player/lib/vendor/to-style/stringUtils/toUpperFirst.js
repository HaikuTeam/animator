module.exports = function (value) {
  return value.length
    ? value.charAt(0).toUpperCase() + value.substring(1)
    : value
}
