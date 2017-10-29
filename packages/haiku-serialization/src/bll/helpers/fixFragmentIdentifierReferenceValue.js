const extractReferenceIdFromUrlReference = require('haiku-bytecode/src/extractReferenceIdFromUrlReference')

/**
 * @function _fixFragmentIdentifierReferenceValue
 * @description Given a key, value, and some randomization, determine whether the given key/value attribute pair
 * warrants replacing with a randomized value, and if so, return a specification object of what to change
 * @param key {String} - The name of the attribute
 * @param value {String} - The value of the attribute
 * @param randomizer {String} - Seeded randomization string to use to modify the ids
 * @returns {Object|undefined}
 */
module.exports = function _fixFragmentIdentifierReferenceValue (key, value, randomizer) {
  if (typeof value !== 'string') return undefined

  var trimmed = value.trim()

  // Probably nothing to do if we got an empty string
  if (trimmed.length < 1) return undefined

  // If this is a URL reference like `url(...)`, try to parse it and return a fix payload if so
  var urlId = extractReferenceIdFromUrlReference(trimmed)
  if (urlId && urlId.length > 0) {
    return {
      originalId: urlId,
      updatedId: urlId + '-' + randomizer,
      updatedValue: 'url(#' + urlId + '-' + randomizer + ')'
    }
  }

  // xlink:hrefs are references to elements in the tree that can affect our style
  if (key === 'xlink:href') {
    if (trimmed[0] === '#') {
      var xlinkId = trimmed.slice(1)
      return {
        originalId: xlinkId,
        updatedId: xlinkId + '-' + randomizer,
        updatedValue: '#' + xlinkId + '-' + randomizer
      }
    }
  }

  // If we go this far, we haven't detected anything we need to fix
  return undefined
}
