const CryptoUtils = require('./../../utils/CryptoUtils')
const _manaWithOnlyStandardProps = require('./manaWithOnlyStandardProps')

module.exports = function _getInsertionPointHash (mana, index, depth) {
  var str = JSON.stringify(_manaWithOnlyStandardProps(mana)) + '-' + index + '-' + depth
  var hash = CryptoUtils.sha256(str).slice(0, 6)
  return hash
}
