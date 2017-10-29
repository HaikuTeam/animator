const visitManaTree = require('@haiku/player/lib/helpers/visitManaTree').default

const SOURCE_ATTRIBUTE = 'source'

module.exports = function _allSourceNodes (rootLocator, mana, iteratee) {
  visitManaTree(rootLocator, mana, (elementName, attributes, children, node, locator, parent, index) => {
    if (attributes && attributes[SOURCE_ATTRIBUTE]) {
      iteratee(node, attributes[SOURCE_ATTRIBUTE], parent, index)
    }
  })
}
