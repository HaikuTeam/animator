var pd = require('pretty-data2').pd
var svgTreeToString = require('./svgTreeToString')

function svgTreeToPrettyString (normalizedSVGObject) {
  var string = svgTreeToString(normalizedSVGObject)
  var pretty = pd.xml(string)
  return pretty
}

module.exports = svgTreeToPrettyString
