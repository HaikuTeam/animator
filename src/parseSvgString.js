var parse = require('svg-parser').parse
var normalizeSvgParseTree = require('./normalizeSvgParseTree')

function parseSvgString (rawSVGString) {
  var tree = parse(rawSVGString)
  var normal = normalizeSvgParseTree(tree)
  return normal
}

module.exports = parseSvgString
