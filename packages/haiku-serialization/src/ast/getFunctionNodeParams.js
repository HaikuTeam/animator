var objectPatternNodeToObject = require('./objectPatternNodeToObject')

var unknowns = 0

function getFunctionNodeParams (node) {
  var params = []

  for (var i = 0; i < node.params.length; i++) {
    let pnode = node.params[i]

    if (pnode.type === 'Identifier') {
      params[i] = pnode.name
    } else if (pnode.type === 'ObjectPattern') {
      params[i] = objectPatternNodeToObject({}, pnode)
    } else {
      // Not sure what else to do if we get here
      params[i] = '__unknown_' + unknowns + '__'
    }
  }

  return params
}

module.exports = getFunctionNodeParams
