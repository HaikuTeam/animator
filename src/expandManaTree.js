var expandManaChildren = require('./expandManaChildren')
var reactToMana = require('@haiku/player/src/helpers/reactToMana')

function isReactElement (thing) {
  return thing && thing.type && thing.$$typeof
}

function expandManaTree (tree) {
  if (isReactElement(tree)) {
    return expandManaTree(reactToMana(tree))
  }

  var hasStringName = typeof tree.elementName === 'string'

  var instance
  if (!hasStringName) {
    if (typeof tree.elementName === 'function') instance = new tree.elementName() // eslint-disable-line
    else instance = tree.elementName
  }

  var elementName
  if (hasStringName) elementName = tree.elementName
  else elementName = instance.constructor.name

  var children
  if (hasStringName) children = tree.children
  else children = instance.template

  var attributes = tree.attributes || {}

  return {
    elementName: elementName,
    attributes: attributes,
    children: expandManaChildren(children)
  }
}

module.exports = expandManaTree
