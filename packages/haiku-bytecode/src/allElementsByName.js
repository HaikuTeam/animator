var visitManaTree = require('@haiku/player/src/helpers/visitManaTree')

function allElementsByName (mana) {
  var elements = {}
  visitManaTree('0', mana, function _visit (elementName, attributes, children, node) {
    if (elementName) {
      if (!elements[elementName]) elements[elementName] = []
      elements[elementName].push(node)
    }
  })
  return elements
}

module.exports = allElementsByName
