const CryptoUtils = require('./../../utils/CryptoUtils')

module.exports = function _createHaikuId (fqa, source, context) {
  const baseString = `${context}|${source}|${fqa}`
  const haikuId = CryptoUtils.sha256(baseString).slice(0, 12)
  return haikuId
}
