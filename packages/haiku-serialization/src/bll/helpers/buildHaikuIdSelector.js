const HAIKU_SELECTOR_PREFIX = 'haiku'

module.exports = function _buildHaikuIdSelector (haikuId) {
  return `${HAIKU_SELECTOR_PREFIX}:${haikuId}`
}
