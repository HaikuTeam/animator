var svgElementNames = require('haiku-bytecode/src/allSvgElementNames')

function isSvgElementName (tagName, scopes) {
  return svgElementNames.indexOf(tagName) !== -1
}

module.exports = isSvgElementName
