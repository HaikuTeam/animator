module.exports = function _isCoordInsideRect (x, y, rect) {
  return rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom
}
