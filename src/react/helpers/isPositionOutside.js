function isPositionOutside (p1, box) {
  if (!p1) return true
  if (!box) return true
  var answer = (
    p1.x < box.left ||
    p1.x > box.right ||
    p1.y < box.top ||
    p1.y > box.bottom
  )
  return answer
}

module.exports = isPositionOutside
