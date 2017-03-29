module.exports = function isMobile (window) {
  return /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
}
