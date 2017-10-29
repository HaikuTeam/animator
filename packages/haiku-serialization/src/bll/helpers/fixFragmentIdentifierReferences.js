const visitManaTree = require('@haiku/player/lib/helpers/visitManaTree').default
const _fixFragmentIdentifierReferenceValue = require('./fixFragmentIdentifierReferenceValue')
const _fixTreeIdReferences = require('./fixTreeIdReferences')

const ROOT_LOCATOR = '0'

// TODO - This only works on attributes whose form is url(#...), e.g. Sketch outputs.
//        But SVG fragment identifiers can be a lot more complex than that.
//
module.exports = function _fixFragmentIdentifierReferences (mana, randomizer) {
  let references = {}
  visitManaTree(ROOT_LOCATOR, mana, function _visitor1 (elementName, attributes, children, node) {
    if (!attributes) return void (0)
    for (let key in attributes) {
      let value = attributes[key]

      // Add randomization to any url() or xlink:href etc to avoid collisions
      // If this function returns undefined it means there's nothing to change
      let fix = _fixFragmentIdentifierReferenceValue(key, value, randomizer)
      if (fix === undefined) continue

      references[fix.originalId] = fix.updatedId
      attributes[key] = fix.updatedValue
    }
  })
  _fixTreeIdReferences(mana, references)
  return mana
}
