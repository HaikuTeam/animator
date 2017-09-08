var createJsxElementNode = require('./createJsxElementNode')
var manaChildrenToJSXChildren = require('./manaChildrenToJSXChildren')

function manaToJSXAST (mana) {
  return createJsxElementNode(
    mana.elementName,
    mana.attributes || {},
    manaChildrenToJSXChildren(mana.children)
  )
}

module.exports = manaToJSXAST
