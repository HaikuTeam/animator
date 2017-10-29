const visitManaTree = require('@haiku/player/lib/helpers/visitManaTree').default

const ROOT_LOCATOR = '0'

/**
 * @function _fixTreeIdReferences
 * @description Fixes all id attributes in the tree that have an entry in the given references table.
 * This is used to predictably convert all ids in a tree into a known set of randomized ids
 * @param mana {Object} - Mana tree object
 * @param references {Object} - Dict that maps old ids to new ids
 * @return {Object} The mutated mana object
 */
module.exports = function _fixTreeIdReferences (mana, references) {
  if (Object.keys(references).length < 1) return mana
  visitManaTree(ROOT_LOCATOR, mana, function _visitor2 (elementName, attributes, children, node) {
    if (!attributes) return void (0)
    for (var id in references) {
      var fixed = references[id]
      if (attributes.id === id) {
        attributes.id = fixed
      }
    }
  })
  return mana
}
