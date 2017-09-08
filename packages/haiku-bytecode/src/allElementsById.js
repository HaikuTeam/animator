var visitManaTree = require('@haiku/player/src/helpers/visitManaTree')

function allElementsById (mana) {
  var elements = {}
  visitManaTree('0', mana, function _visit (elementName, attributes, children, node) {
    if (attributes) {
      if (attributes.id) {
        if (!elements[attributes.id]) elements[attributes.id] = []
        elements[attributes.id].push(node)
      }
    }
  })
  return elements
}

module.exports = allElementsById
