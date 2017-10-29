function roundUp (numToRound, multiple) {
  if (multiple === 0) return numToRound
  const remainder = Math.abs(numToRound) % multiple
  if (remainder === 0) return numToRound
  if (numToRound < 0) return -(Math.abs(numToRound) - remainder)
  return numToRound + multiple - remainder
}

module.exports = roundUp
