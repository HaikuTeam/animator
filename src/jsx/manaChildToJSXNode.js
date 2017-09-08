var manaToJSXAST = require('./manaToJSXAST')

function manaChildToJSXNode (child) {
  if (typeof child === 'string') {
    return {
      type: 'StringLiteral',
      value: child
    }
  }

  if (typeof child === 'number') {
    return {
      type: 'NumericLiteral',
      value: child
    }
  }

  return manaToJSXAST(child)
}

module.exports = manaChildToJSXNode
