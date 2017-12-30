function isCoordInsideRect (x, y, rect) {
  return rect.left <= x && x <= rect.right && rect.top <= y && y <= rect.bottom
}

function modOfIndex (idx, max) {
  return (idx % max + max) % max
}

function roundUp (numToRound, multiple) {
  if (multiple === 0) return numToRound
  const remainder = Math.abs(numToRound) % multiple
  if (remainder === 0) return numToRound
  if (numToRound < 0) return -(Math.abs(numToRound) - remainder)
  return numToRound + multiple - remainder
}

function transformVectorByMatrix (out, v, m) {
  out[0] = m[0] * v[0] + m[4] * v[1] + m[12]
  out[1] = m[1] * v[0] + m[5] * v[1] + m[13]
  return out
}

module.exports = {
  isCoordInsideRect,
  modOfIndex,
  roundUp,
  transformVectorByMatrix
}
