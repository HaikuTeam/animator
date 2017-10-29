const _safeElementName = require('./safeElementName')
const merge = require('lodash.merge')

module.exports = function _ensureRootDisplayAttributes (mana) {
  merge(mana.attributes, {
    style: {
      position: 'relative',
      width: '550px', // default artboard size, see haiku-creator
      height: '400px', // default artboard size, see haiku-creator
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
