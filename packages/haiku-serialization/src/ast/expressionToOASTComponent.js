function expressionToOASTComponent (exp, key, keyChain) {
  if (exp === undefined || exp === null) {
    return {
      type: 'NullLiteral',
    };
  }

  if (exp === true || exp === false) {
    return {
      type: 'BooleanLiteral',
      value: exp,
    };
  }

  if (typeof exp === 'string') {
    return {
      type: 'StringLiteral',
      value: exp,
      extra: {
        raw: JSON.stringify(exp),
      },
    };
  }

  if (typeof exp === 'number') {
    return {
      type: 'NumericLiteral',
      value: exp,
      extra: {
        raw: exp.toString(),
      },
    };
  }

  if (Array.isArray(exp)) {
    const elements = [];
    for (let i = 0; i < exp.length; i++) {
      elements.push(expressionToOASTComponent(exp[i], i));
    }
    return {
      type: 'ArrayExpression',
      elements,
    };
  }

  if (exp.__function) {
    return RFOToFunctionAST(exp.__function, key);
  }
  if (exp.__value) {
    return expressionToOASTComponent(exp.__value, key, keyChain);
  }
  if (exp.__reference) {
    return {
      type: 'Identifier',
      name: exp.__reference,
    };
  }

  if (typeof exp === 'object') {
    return objectToOAST(exp, keyChain);
  }

  if (typeof exp === 'function') {
    return functionToASTExpression(exp);
  }

  throw new Error('Unable to compile expression ' + exp);
}

module.exports = expressionToOASTComponent;

let RFOToFunctionAST = require('./RFOToFunctionAST');
let objectToOAST = require('./objectToOAST');
let functionToASTExpression = require('./functionToASTExpression');
