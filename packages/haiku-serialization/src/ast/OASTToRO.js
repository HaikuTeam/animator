let isFunctionNode = require('./isFunctionNode');
let getFunctionNodeName = require('./getFunctionNodeName');
let getFunctionNodeParams = require('./getFunctionNodeParams');
let getFunctionNodeBody = require('./getFunctionNodeBody');
let computeUnaryExpression = require('./computeUnaryExpression');

function OASTToRO (oast) {
  if (oast.type === 'ObjectExpression') {
    const oout = {};
    for (let i = 0; i < oast.properties.length; i++) {
      const onode = oast.properties[i];
      const key = onode.key.name || onode.key.value;
      oout[key] = OASTToRO(onode.value);
    }
    return {
      __value: oout,
    };
  }

  if (oast.type === 'ArrayExpression') {
    const aout = [];
    for (let j = 0; j < oast.elements.length; j++) {
      const anode = oast.elements[j];
      aout[j] = OASTToRO(anode);
    }
    return {
      __value: aout,
    };
  }

  if (oast.type === 'Identifier') {
    return {
      __reference: oast.name,
    };
  }

  if (isFunctionNode(oast)) {
    return {
      __function: {
        type: oast.type,
        kind: oast.kind,
        name: getFunctionNodeName(oast),
        params: getFunctionNodeParams(oast),
        body: getFunctionNodeBody(oast),
      },
    };
  }

  if (oast.type === 'NullLiteral') {
    return null;
  }

  if (oast.type === 'UnaryExpression') {
    return {
      __value: computeUnaryExpression(oast),
    };
  }

  // Hacky special case where we handle Haiku.inject(function(){...}) and return the *inner function*
  if (oast.type === 'CallExpression') {
    if (oast.callee && oast.callee.type === 'MemberExpression') {
      if (oast.callee.object.name === 'Haiku' && oast.callee.property.name === 'inject') {
        if (oast.arguments[0]) {
          const rfo = OASTToRO(oast.arguments[0]);
          // Add this flag so the Haiku Core knows it needs to wrap the reified function
          // inside a Haiku.inject call so it is correctly bootstrapped during editing runtime
          if (rfo && rfo.__function) {
            rfo.__function.injectee = true;
          }
          return rfo;
        }
      }
    }
  }

  // StringLiteral, etc
  return {
    __value: oast.value,
  };
}

module.exports = OASTToRO;
