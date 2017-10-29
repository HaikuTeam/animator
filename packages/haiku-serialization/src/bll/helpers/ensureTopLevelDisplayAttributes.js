const merge = require('lodash.merge')
const _safeElementName = require('./safeElementName')

module.exports = function _ensureTopLevelDisplayAttributes (mana) {
  merge(mana.attributes, {
    style: {
      position: 'absolute',
      margin: '0',
      padding: '0',
      border: '0'
    }
  })

  // If our context is SVG, ensure it has appropriate SVG attributes
  if (_safeElementName(mana) === 'svg') {
    merge(mana.attributes, {
      version: '1.1',
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink'
    })
  }
}
