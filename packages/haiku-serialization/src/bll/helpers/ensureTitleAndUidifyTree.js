const path = require('path')
const find = require('lodash.find')
const pascalcase = require('pascalcase')
const _safeElementName = require('./safeElementName')
const _visitManaTreeSpecial = require('./visitManaTreeSpecial')
const _createHaikuId = require('./createHaikuId')

const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const HAIKU_TITLE_ATTRIBUTE = 'haiku-title'

/**
 * @function _ensureTitleAndUidifyTree
 * @param mana {Object} - A mana tree
 * @param source {String} - Relpath to the source file of this tree (usually an SVG file)
 * @param context {String} - Flexible context string for collision avoidance (usually folder + relpath)
 * @param hash {String} - Digest of previous content, used as a seed for number generation
 * @param options {Object}
 */
module.exports = function _ensureTitleAndUidifyTree (mana, source, context, hash, options) {
  if (!options) options = {}

  // First ensure the element has a title (this is used to display a human-friendly name in the ui)
  if (!mana.attributes) mana.attributes = {}
  if (options.title) {
    mana.attributes[HAIKU_TITLE_ATTRIBUTE] = options.title
  }
  if (!mana.attributes[HAIKU_TITLE_ATTRIBUTE]) {
    let title
    if (mana.attributes.source) {
      // The file name usually works as a good baseline, e.g. 'FooBar.svg'
      title = path.basename(mana.attributes.source, path.extname(mana.attributes.source))
    }
    if (!title) {
      if (mana.children) {
        // Sketch-sourced trees always have a title matching that artboard/slice's name
        const el = find(mana.children, { elementName: 'title' })
        if (el && el.children && typeof el.children[0] === 'string') {
          title = el.children[0]
        }
      }
    }
    if (!title) {
      if (source && source.length > 1) {
        // The passed in source relpath should work ok
        title = path.basename(source, path.extname(source))
        title = title.replace('Bytecode', '') // Clean up the name if this is a bytecode-source doc
      }
    }
    if (!title) {
      // Otherwise, fall back to the element name
      title = pascalcase(_safeElementName(mana) || 'node')
    }
    mana.attributes[HAIKU_TITLE_ATTRIBUTE] = title
  }

  // Now make sure all elements in the tree get a preditable identifier assigned. It is critical that
  // the UID generation be based on the existing tree's contents so that this same logic can run
  // in different processes and still give us an identical result, otherwise they will get out of sync
  _visitManaTreeSpecial('*', hash, mana, (node, fqa) => {
    if (typeof node !== 'object') return void (0)
    if (!node.attributes) node.attributes = {}

    // For cases like pasting a component, the caller might want to assign a fresh id even though
    // we may already have one assigned to the node, hence the forceAssignId option
    if (!node.attributes[HAIKU_ID_ATTRIBUTE] || options.forceAssignId) {
      let haikuId = _createHaikuId(fqa, source, context)
      node.attributes[HAIKU_ID_ATTRIBUTE] = haikuId
    }

    if (node.attributes.id && options.idRandomizer) {
      node.attributes.id += ('-' + options.idRandomizer)
    }
  })
}
