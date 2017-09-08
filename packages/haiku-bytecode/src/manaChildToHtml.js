var cannotUse = require('./cannotUse')
var alreadySerial = require('./alreadySerial')

var EMPTY = ''

function manaChildToHtml (child, mapping, options) {
  if (cannotUse(child)) return EMPTY
  if (alreadySerial(child)) {
    return child
  } else {
    return manaToHtml(EMPTY, child, mapping, options)
  }
}

module.exports = manaChildToHtml

var manaToHtml = require('./manaToHtml')
