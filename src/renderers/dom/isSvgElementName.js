var svgElementNames = require('haiku-bytecode/src/allSvgElementNames')

function isSvgElementName (tagName) {
  return svgElementNames.indexOf(tagName) !== -1
}

module.exports = isSvgElementName
