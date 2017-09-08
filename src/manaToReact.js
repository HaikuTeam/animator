var createReactElement = require('./createReactElement')
var manaChildrenToReact = require('./manaChildrenToReact')

function manaToReact (mana) {
  var type = mana.elementName || 'div'
  var props = mana.attributes || {}
  var children = manaChildrenToReact(mana.children)
  return createReactElement(type, props, children)
}

module.exports = manaToReact
