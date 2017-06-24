var svgElementNames = require('./../../helpers/allSvgElementNames')

function isSvgElementName (tagName, scopes) {
  return svgElementNames.indexOf(tagName) !== -1
}

module.exports = isSvgElementName
