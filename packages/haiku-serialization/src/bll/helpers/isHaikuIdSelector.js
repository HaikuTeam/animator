const HAIKU_SELECTOR_PREFIX = 'haiku'

module.exports = function _isHaikuIdSelector (selector) {
  return selector && selector.slice(0, 5) === HAIKU_SELECTOR_PREFIX && selector[5] === ':'
}
