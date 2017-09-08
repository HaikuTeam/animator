var compact = require('lodash.compact')
var fixSvgAttributes = require('./fixSvgAttributes')

function normalizeSvgParseTree (obj) {
  if (!obj.name) return undefined
  return {
    elementName: obj.name,
    attributes: fixSvgAttributes(obj.attributes || {}, {
      camelize: false
    }),
    children: obj.children && compact(obj.children.map(normalizeSvgParseTree))
  }
}

module.exports = normalizeSvgParseTree
