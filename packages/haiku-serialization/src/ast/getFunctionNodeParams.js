let objectPatternNodeToObject = require('./objectPatternNodeToObject');

let unknowns = 0;

function getFunctionNodeParams (node) {
  const params = [];

  for (let i = 0; i < node.params.length; i++) {
    const pnode = node.params[i];

    if (pnode.type === 'Identifier') {
      params[i] = pnode.name;
    } else if (pnode.type === 'ObjectPattern') {
      params[i] = objectPatternNodeToObject({}, pnode);
    } else {
      // Not sure what else to do if we get here
      params[i] = '__unknown_' + unknowns + '__';
    }
  }

  return params;
}

module.exports = getFunctionNodeParams;
