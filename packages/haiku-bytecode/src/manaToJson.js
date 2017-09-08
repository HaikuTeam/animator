var cleanMana = require('./cleanMana')

module.exports = function manaToJson (mana, replacer, spacing) {
  var out = cleanMana(mana)
  return JSON.stringify(out, replacer || null, spacing || 2)
}
