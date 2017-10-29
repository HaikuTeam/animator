const visitManaTree = require('@haiku/player/lib/helpers/visitManaTree').default

const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const ROOT_LOCATOR = '0'

module.exports = function _getAllElementsByHaikuId (mana) {
  var elements = {}
  visitManaTree(ROOT_LOCATOR, mana, function (elementName, attributes, children, node) {
    if (attributes && attributes[HAIKU_ID_ATTRIBUTE]) {
      elements[attributes[HAIKU_ID_ATTRIBUTE]] = node
    }
  })
  return elements
}
