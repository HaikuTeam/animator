const path = require('path')
const find = require('lodash.find')
const merge = require('lodash.merge')
const pascalcase = require('pascalcase')
const SVGPoints = require('@haiku/player/lib/helpers/SVGPoints').default
const convertManaLayout = require('@haiku/player/lib/layout/convertManaLayout').default
const upgradeBytecodeInPlace = require('@haiku/player/lib/helpers/upgradeBytecodeInPlace').default
const visitManaTree = require('@haiku/player/lib/helpers/visitManaTree').default
const insertAttributesIntoTimelineGroup = require('haiku-bytecode/src/insertAttributesIntoTimelineGroup')
const extractReferenceIdFromUrlReference = require('haiku-bytecode/src/extractReferenceIdFromUrlReference')
const States = require('haiku-bytecode/src/States')

const BaseModel = require('./BaseModel')

const CryptoUtils = require('./../utils/CryptoUtils')

const ROOT_LOCATOR = '0'
const HAIKU_ID_ATTRIBUTE = 'haiku-id'
const SOURCE_ATTRIBUTE = 'source'
const HAIKU_TITLE_ATTRIBUTE = 'haiku-title'
const HAIKU_SELECTOR_PREFIX = 'haiku'

const TEMPLATE_METADATA_ATTRIBUTES = {
  version: true,
  encoding: true,
  standalone: true,
  xmlns: true,
  'xmlns:xlink': true,
  'xlink:href': true, // A recent addition. Better kept in tree, or as property?
  lang: true,
  charset: true,
  content: true,
  'http-equiv': true,
  scheme: true,
  source: true,
  identifier: true,
  'haiku-id': true,
  'haiku-title': true,
  'haiku-source': true
}

const SELECTOR_ATTRIBUTES = {
  'id': 'id',
  'class': 'class',
  'className': 'class',
  'name': 'name',
  'type': 'type'
}

/**
 * @class Template
 * @description
 *.  Collection of static class methods for logic related to a component's template ("mana").
 */
class Template extends BaseModel {}

Template.DEFAULT_OPTIONS = {
  required: {}
}

BaseModel.extend(Template)

Template.prepareMana = (mana, hash) => {
  // Each url(#whatever) needs to be unique to avoid styling collisions in the DOM
  Template.fixFragmentIdentifierReferences(mana, hash)

  Template.ensureTitleAndUidifyTree(
    mana,
    path.normalize(mana.attributes[SOURCE_ATTRIBUTE]),
    hash
  )

  Template.ensureTopLevelDisplayAttributes(mana)

  convertManaLayout(mana)

  return mana
}

Template.prepareManaAndBuildTimelinesObject = (mana, hash, timelineName, timelineTime) => {
  mana = Template.prepareMana(mana, hash)

  const timelinesObject = Template.hoistTreeAttributes(
    mana,
    timelineName,
    timelineTime
  )

  return timelinesObject
}

Template.mirrorHaikuUids = (fromNode, toNode) => {
  if (!toNode.attributes) toNode.attributes = {}

  // Create (or overwrite) a haiku-id matching the existing tree's node
  toNode.attributes[HAIKU_ID_ATTRIBUTE] = fromNode.attributes[HAIKU_ID_ATTRIBUTE]

  if (!fromNode.children || fromNode.children.length < 1) return void (0)
  if (!toNode.children || toNode.children.length < 1) return void (0)

  // Different number of kids indicates structural change; impossible to do a consistent mirror
  if (fromNode.children.length !== toNode.children.length) return void (0)

  for (let i = 0; i < fromNode.children.length; i++) {
    const fromNodeChild = fromNode.children[i]
    const toNodeChild = toNode.children[i]

    // String children don't have attributes
    if (typeof fromNodeChild === 'string') {
      continue
    }

    // Different element name indicates structural change; impossible to do a consistent mirror
    if (fromNodeChild.elementName !== toNodeChild.elementName) {
      continue
    }

    Template.mirrorHaikuUids(fromNodeChild, toNodeChild) // Recursive
  }
}

Template.manaWithOnlyMinimalProps = (mana) => {
  if (mana && typeof mana === 'object') {
    var out = {}

    out.elementName = mana.elementName

    if (typeof mana.elementName === 'object') {
      // When written to the file, we should end up with `elementName: fooBar,...`
      // This assumes that a require() statement gets added to the AST later
      out.elementName = {
        __reference: out.elementName.__reference
      }
    }

    if (mana.attributes) {
      out.attributes = {}

      if (mana.attributes[HAIKU_ID_ATTRIBUTE]) {
        out.attributes[HAIKU_ID_ATTRIBUTE] = mana.attributes[HAIKU_ID_ATTRIBUTE]
      }

      if (mana.attributes[SOURCE_ATTRIBUTE]) {
        out.attributes[SOURCE_ATTRIBUTE] = mana.attributes[SOURCE_ATTRIBUTE]
      }

      if (mana.attributes.id) {
        out.attributes.id = mana.attributes.id
      }
    }

    out.children = mana.children && mana.children.map(Template.manaWithOnlyMinimalProps)

    return out
  } else if (typeof mana === 'string') {
    return mana
  }
}

Template.manaWithOnlyStandardProps = (mana) => {
  if (mana && typeof mana === 'object') {
    var out = {}

    out.elementName = mana.elementName

    if (typeof mana.elementName === 'object') {
      // When written to the file, we should end up with `elementName: fooBar,...`
      // This assumes that a require() statement gets added to the AST later
      out.elementName = {
        __reference: out.elementName.__reference
      }
    }

    if (mana.attributes) {
      out.attributes = {}
      for (const key1 in TEMPLATE_METADATA_ATTRIBUTES) {
        if (mana.attributes[key1]) {
          out.attributes[key1] = mana.attributes[key1]
        }
      }
      for (const key2 in SELECTOR_ATTRIBUTES) {
        if (mana.attributes[key2]) {
          out.attributes[key2] = mana.attributes[key2]
        }
      }
    }

    out.children = mana.children && mana.children.map(Template.manaWithOnlyStandardProps)

    return out
  } else if (typeof mana === 'string') {
    return mana
  }
}

Template.manaToDynamicBytecode = (mana, identifier, modpath, options = {}) => {
  const referenceRandomizer = `${identifier}-${modpath.replace(/\W+/g, '-')}`

  const timelines = Template.prepareManaAndBuildTimelinesObject(
    mana,
    referenceRandomizer,
    'Default',
    0
  )

  const states = {}

  Timeline.eachTimelineKeyframeDescriptor(timelines, (keyframeDescriptor, keyframeMs, propertyName, componentSelector, timelineName) => {
    const elementNode = Element.querySelectorAll(componentSelector, mana)[0]

    if (Property.ALWAYS_CREATE_AS_PROPERTY_NEVER_AS_STATE[propertyName]) {
      // We don't need to do anything - the property is already in the timeline!
    } else {
      // For certain hidden elements we don't want to hoist the content, since it's just metadata/noise
      if (propertyName === 'content') {
        if (!Property.TEXT_FRIENDLY_SVG_ELEMENTS[elementNode.elementName] && !Property.TEXT_FRIENDLY_HTML_ELEMENTS[elementNode.elementName]) {
          return null
        }
      }

      // If a coloration is listed as 'none', it's probably not worth exposing due to noise
      if (propertyName === 'fill' || propertyName === 'stroke') {
        if (keyframeDescriptor.value === 'none') {
          return null
        }
      }

      const stateName = State.buildStateNameFromElementPropertyName(0, states, elementNode, propertyName)

      const stateDescriptor = States.autoCastToType({
        value: Template.fixKeyframeValue(elementNode, propertyName, keyframeDescriptor.value),
        access: Property.PRIVATE_PROPERTY_WHEN_HOISTING_TO_STATE[propertyName] ? 'private' : 'public'
      })

      states[stateName] = stateDescriptor

      keyframeDescriptor.value = Expression.buildStateInjectorFunction(stateName)
    }
  })

  const bytecode = {
    metadata: {
      uuid: 'HAIKU_SHARE_UUID',
      type: 'haiku',
      name: identifier,
      relpath: modpath
    },
    options: {},
    states,
    eventHandlers: {},
    timelines,
    template: mana
  }

  upgradeBytecodeInPlace(bytecode)

  return bytecode
}

Template.manaTreeToDepthFirstArray = function manaTreeToDepthFirstArray (arr, mana) {
  if (!mana || typeof mana === 'string') return arr
  arr.push(mana)
  for (let i = 0; i < mana.children.length; i++) {
    const child = mana.children[i]
    Template.manaTreeToDepthFirstArray(arr, child)
  }
  return arr
}

/**
 * @function _hoistTreeAttributes
 * @description Given a mana tree, move all of its control attributes (that is, things that affect its
 * behavior that the user can control) into a timeline object.
 */
Template.hoistTreeAttributes = function hoistTreeAttributes (mana, timelineName, timelineTime) {
  const elementsByHaikuId = Template.getAllElementsByHaikuId(mana)
  const timelineStructure = {}

  // We set this on the 'Default' timeline always because an element's properties
  // are interpreted to mean whatever the defaults are supposed to be at time 0.
  timelineStructure[timelineName] = {}
  const theTimelineObj = timelineStructure[timelineName]

  for (const haikuId in elementsByHaikuId) {
    const node = elementsByHaikuId[haikuId]
    Template.hoistNodeAttributes(node, haikuId, theTimelineObj, timelineName, timelineTime, 'assign')
  }

  return timelineStructure
}

Template.getControlAttributes = function getControlAttributes (attributes) {
  const out = {}
  for (const key in attributes) {
    if (SELECTOR_ATTRIBUTES[key]) continue
    if (TEMPLATE_METADATA_ATTRIBUTES[key]) continue
    out[key] = attributes[key]
  }
  return out
}

Template.hoistNodeAttributes = function hoistNodeAttributes (manaNode, haikuId, timelineObj, timelineName, timelineTime, mergeStrategy) {
  const controlAttributes = Template.getControlAttributes(manaNode.attributes)

  // Hoist the text content attribute as a property as well, inferring from structure
  if (manaNode.children && manaNode.children.length === 1 && typeof manaNode.children[0] === 'string') {
    // Remove this text node from the actual tree since it's hoisted now
    controlAttributes.content = manaNode.children[0]
    manaNode.children = []
  }

  // TODO: Use this to populate any default attributes we want to be written into
  // the file explicitly. TODO: This hasn't been used for many months; remove?
  const defaultAttributes = {}

  // Don't create any empty groups
  if (Object.keys(defaultAttributes).length > 0 || Object.keys(controlAttributes).length > 0) {
    const haikuIdSelector = Template.buildHaikuIdSelector(haikuId)
    if (!timelineObj[haikuIdSelector]) timelineObj[haikuIdSelector] = {}
    const timelineGroup = timelineObj[haikuIdSelector]

    insertAttributesIntoTimelineGroup(timelineGroup, timelineTime, defaultAttributes, mergeStrategy)
    insertAttributesIntoTimelineGroup(timelineGroup, timelineTime, controlAttributes, mergeStrategy)
  }

  // Clear off attributes that have been 'hoisted' into the control objects
  for (const attrKey in manaNode.attributes) {
    if (attrKey in controlAttributes) {
      delete manaNode.attributes[attrKey]
    }
  }
}

Template.createHaikuId = function createHaikuId (fqa, source, context) {
  const baseString = `${context}|${source}|${fqa}`
  const haikuId = CryptoUtils.sha256(baseString).slice(0, 12)
  return haikuId
}

Template.buildHaikuIdSelector = function buildHaikuIdSelector (haikuId) {
  return `${HAIKU_SELECTOR_PREFIX}:${haikuId}`
}

Template.isHaikuIdSelector = function isHaikuIdSelector (selector) {
  return selector && selector.slice(0, 5) === HAIKU_SELECTOR_PREFIX && selector[5] === ':'
}

Template.haikuSelectorToHaikuId = function haikuSelectorToHaikuId (selector) {
  return selector.split(':')[1]
}

Template.getInsertionPointHash = function getInsertionPointHash (mana, index, depth, len = 6) {
  const str = JSON.stringify(Template.manaWithOnlyMinimalProps(mana)) + '-' + index + '-' + depth
  const hash = Template.getHash(str, len)
  return hash
}

Template.getHash = function getHash (str, len = 6) {
  const hash = CryptoUtils.sha256(str).slice(0, len)
  return hash
}

Template.getAllElementsByHaikuId = function getAllElementsByHaikuId (mana) {
  const elements = {}
  visitManaTree(ROOT_LOCATOR, mana, (elementName, attributes, children, node) => {
    if (attributes && attributes[HAIKU_ID_ATTRIBUTE]) {
      elements[attributes[HAIKU_ID_ATTRIBUTE]] = node
    }
  })
  return elements
}

Template.fixManaSourceAttribute = function fixManaSourceAttribute (mana, relpath) {
  if (!mana.attributes[SOURCE_ATTRIBUTE]) {
    mana.attributes[SOURCE_ATTRIBUTE] = path.normalize(relpath)
  }
}

/**
 * @function _fixTreeIdReferences
 * @description Fixes all id attributes in the tree that have an entry in the given references table.
 * This is used to predictably convert all ids in a tree into a known set of randomized ids
 * @param mana {Object} - Mana tree object
 * @param references {Object} - Dict that maps old ids to new ids
 * @return {Object} The mutated mana object
 */
Template.fixTreeIdReferences = function fixTreeIdReferences (mana, references) {
  if (Object.keys(references).length < 1) {
    return mana
  }
  visitManaTree(ROOT_LOCATOR, mana, (elementName, attributes, children, node) => {
    if (!attributes) {
      return void (0)
    }
    for (let id in references) {
      const fixed = references[id]
      if (attributes.id === id) {
        attributes.id = fixed
      }
    }
  })
  return mana
}

/**
 * @function fixFragmentIdentifierReferenceValue
 * @description Given a key, value, and some randomization, determine whether the given key/value attribute pair
 * warrants replacing with a randomized value, and if so, return a specification object of what to change
 * @param key {String} - The name of the attribute
 * @param value {String} - The value of the attribute
 * @param randomizer {String} - Seeded randomization string to use to modify the ids
 * @returns {Object|undefined}
 */
Template.fixFragmentIdentifierReferenceValue = function fixFragmentIdentifierReferenceValue (key, value, randomizer) {
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

Template.fixKeyframeValue = function fixKeyframeValue (elementNode, propertyName, keyframeValue) {
  const elementName = elementNode && elementNode.elementName
  if (elementName === 'path' && propertyName === 'd') {
    return SVGPoints.pathToPoints(keyframeValue)
  } else if ((elementName === 'polygon' || elementName === 'polyline') && propertyName === 'points') {
    return SVGPoints.polyPointsStringToPoints(keyframeValue)
  }
  return keyframeValue
}

Template.fixFragmentIdentifierReferences = function fixFragmentIdentifierReferences (mana, randomizer) {
  const references = {}

  visitManaTree(ROOT_LOCATOR, mana, (elementName, attributes, children, node) => {
    if (!attributes) {
      return void (0)
    }

    for (const key in attributes) {
      const value = attributes[key]

      // Add randomization to any url() or xlink:href etc to avoid collisions
      // If this function returns undefined it means there's nothing to change
      const fix = Template.fixFragmentIdentifierReferenceValue(key, value, randomizer)
      if (fix === undefined) {
        continue
      }

      references[fix.originalId] = fix.updatedId
      attributes[key] = fix.updatedValue
    }
  })

  Template.fixTreeIdReferences(mana, references)

  return mana
}

// Yes, we have a bunch of visitor functions, all of which probably should be consolidated
// into just one utility. This had previously been obscured by the fact that these lived
// as individual helpers scattered into different modules; consolidating them all here
// was a first step. TODO: Please refactor!

Template.visitTemplate = function visitTemplate (template, parent, iteratee) {
  if (template) {
    iteratee(template, parent)
    if (template.children) {
      for (let i = 0; i < template.children.length; i++) {
        const child = template.children[i]
        if (!child || typeof child === 'string') {
          continue
        }
        Template.visitTemplate(child, template, iteratee)
      }
    }
  }
}

Template.visitManaTreeSpecial = function visitManaTreeSpecial (address, hash, mana, iteratee) {
  address += `:[${hash}]${Element.safeElementName(mana)}(${(mana.attributes && mana.attributes.id) ? '#' + mana.attributes.id : ''})`
  iteratee(mana, address)
  if (!mana.children || mana.children.length < 1) return void (0)
  for (let i = 0; i < mana.children.length; i++) {
    const child = mana.children[i]
    if (child && typeof child === 'object') {
      Template.visitManaTreeSpecial(address, hash + '-' + i, child, iteratee)
    }
  }
}

Template.visit = function visit (node, visitor) {
  if (node) {
    visitor(node, null)
    if (!node.children) return
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i]
      if (typeof child === 'string') continue
      Template.visit(child, visitor)
    }
  }
}

Template.ensureTopLevelDisplayAttributes = function ensureTopLevelDisplayAttributes (mana) {
  merge(mana.attributes, {
    style: {
      position: 'absolute',
      margin: '0',
      padding: '0',
      border: '0'
    }
  })
  // If our context is SVG, ensure it has appropriate SVG attributes
  if (Element.safeElementName(mana) === 'svg') {
    merge(mana.attributes, {
      version: '1.1',
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink'
    })
  }
}

/**
 * @function ensureTitleAndUidifyTree
 * @param mana {Object} - A mana tree
 * @param source {String} - Relpath to the source file of this tree (usually an SVG file)
 * @param context {String} - Flexible context string for collision avoidance (usually folder + relpath)
 * @param hash {String} - Digest of previous content, used as a seed for number generation
 * @param options {Object}
 */
Template.ensureTitleAndUidifyTree = function ensureTitleAndUidifyTree (mana, source, context, hash, options) {
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
      title = pascalcase(Element.safeElementName(mana) || 'node')
    }
    mana.attributes[HAIKU_TITLE_ATTRIBUTE] = title
  }

  // Now make sure all elements in the tree get a preditable identifier assigned. It is critical that
  // the UID generation be based on the existing tree's contents so that this same logic can run
  // in different processes and still give us an identical result, otherwise they will get out of sync
  Template.visitManaTreeSpecial('*', hash, mana, (node, fqa) => {
    if (typeof node !== 'object') return void (0)
    if (!node.attributes) node.attributes = {}

    // For cases like pasting a component, the caller might want to assign a fresh id even though
    // we may already have one assigned to the node, hence the forceAssignId option
    if (!node.attributes[HAIKU_ID_ATTRIBUTE] || options.forceAssignId) {
      const haikuId = Template.createHaikuId(fqa, source, context)
      node.attributes[HAIKU_ID_ATTRIBUTE] = haikuId
    }

    if (node.attributes.id && options.idRandomizer) {
      node.attributes.id += ('-' + options.idRandomizer)
    }
  })
}

Template.ensureRootDisplayAttributes = function ensureRootDisplayAttributes (mana) {
  merge(mana.attributes, {
    style: {
      position: 'relative',
      width: '550px', // default artboard size, see haiku-creator
      height: '400px', // default artboard size, see haiku-creator
      margin: '0',
      padding: '0',
      border: '0'
    }
  })
  // If our context is SVG, ensure it has appropriate SVG attributes
  if (Element.safeElementName(mana) === 'svg') {
    merge(mana.attributes, {
      version: '1.1',
      xmlns: 'http://www.w3.org/2000/svg',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink'
    })
  }
}

Template.cleanTemplate = function cleanTemplate (mana) {
  visitManaTree(ROOT_LOCATOR, mana, (elementName, attributes, children, node) => {
    // Clean these in-memory only properties that get added (don't want to write these to the file)
    delete node.__depth
    delete node.__index
  })
}

/**
 * @method areTemplatesEquivalent
 * @description Determines whether two template objects have the same structure
 * Note: This check compares element names and children (recursively), but not attributes!
 * @returns {Boolean}
 */
Template.areTemplatesEquivalent = function areTemplatesEquivalent (t1, t2) {
  if (!t1 && !t2) return true
  if (t1 && !t2) return false
  if (!t1 && t2) return false
  if (t1.elementName !== t2.elementName) return false
  if (!t1.children && !t2.children) return true
  if (t1.children && !t2.children) return false
  if (!t1.children && t2.children) return false
  if (t1.children.length !== t2.children.length) return false
  for (let i = 0; i < t1.children.length; i++) {
    const c1 = t1.children[i]
    const c2 = t2.children[i]
    if (!Template.areTemplatesEquivalent(c1, c2)) {
      return false
    }
  }
  return true
}

Template.allSourceNodes = function allSourceNodes (rootLocator, mana, iteratee) {
  visitManaTree(rootLocator, mana, (elementName, attributes, children, node, locator, parent, index) => {
    if (attributes && attributes[SOURCE_ATTRIBUTE]) {
      iteratee(node, attributes[SOURCE_ATTRIBUTE], parent, index)
    }
  })
}

Template.visitManaTree = (mana, iteratee) => {
  return visitManaTree(ROOT_LOCATOR, mana, iteratee)
}

Template.clone = (out, mana) => {
  if (!mana) return mana

  if (typeof mana !== 'object') return mana

  out.elementName = mana.elementName

  if (mana.attributes) {
    out.attributes = {}

    for (const key in mana.attributes) {
      const prop = mana.attributes[key]

      if (prop && typeof prop === 'object') {
        out.attributes[key] = {}

        for (const subkey in prop) {
          out.attributes[key][subkey] = prop[subkey]
        }
      } else {
        out.attributes[key] = prop
      }
    }
  }

  if (mana.children) {
    out.children = []

    for (let i = 0; i < mana.children.length; i++) {
      out.children[i] = Template.clone({}, mana.children[i])
    }
  }

  return out
}

module.exports = Template

// Down here to avoid Node circular dependency stub objects. #FIXME
const Element = require('./Element')
const Expression = require('./Expression')
const Property = require('./Property')
const State = require('./State')
const Timeline = require('./Timeline')
