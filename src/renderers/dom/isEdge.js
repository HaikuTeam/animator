module.exports = function isEdge (window) {
  return /Edge\/\d./i.test(window.navigator.userAgent)
}
