module.exports = function getSortedKeyframeKeys (property) {
  if (!property) return []
  return Object.keys(property).map((ms) => parseInt(ms, 10)).sort((a, b) => a - b)
}
