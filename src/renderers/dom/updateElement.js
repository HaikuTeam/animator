var applyLayout = require('./applyLayout')
var assignAttributes = require('./assignAttributes')
var isSvgElementName = require('./isSvgElementName')
var getTypeAsString = require('./getTypeAsString')

var OBJECT = 'object'

function updateElement (domElement, virtualElement, parentNode, parentVirtualElement, locator, hash, options, scopes, isPatchOperation) {
  // If a text node, go straight to 'replace' since we don't know the tag name
  if (isTextNode(virtualElement, scopes)) {
    replaceElementWithText(domElement, virtualElement, options, scopes)
    return virtualElement
  }

  if (!domElement.haiku) domElement.haiku = {}

  var domTagName = domElement.tagName.toLowerCase().trim()
  var elName = normalizeName(getTypeAsString(virtualElement))
  var virtualElementTagName = elName.toLowerCase().trim()
  var incomingKey = virtualElement.key || virtualElement.attributes && virtualElement.attributes.key
  var existingKey = domElement.haiku && domElement.haiku.key
  var isKeyDifferent = incomingKey !== null && incomingKey !== undefined && incomingKey !== existingKey

  if (domTagName !== virtualElementTagName) {
    return replaceElement(domElement, virtualElement, parentNode, parentVirtualElement, locator, hash, options, scopes)
  }

  if (isKeyDifferent) {
    return replaceElement(domElement, virtualElement, parentNode, parentVirtualElement, locator, hash, options, scopes)
  }

  if (isSvgElementName(elName, scopes)) {
    updateSvgElement(domElement, elName, virtualElement.attributes, virtualElement.children, virtualElement, parentNode, parentVirtualElement, locator, hash, options, scopes, isPatchOperation, isKeyDifferent)
    if (incomingKey !== undefined && incomingKey !== null) domElement.haiku.key = incomingKey
    return domElement
  }

  applyLayout(domElement, virtualElement, parentNode, parentVirtualElement, options, scopes, isPatchOperation, isKeyDifferent)
  if (virtualElement.attributes && typeof virtualElement.attributes === OBJECT) assignAttributes(domElement, virtualElement.attributes, options, scopes, isPatchOperation, isKeyDifferent)
  if (incomingKey !== undefined && incomingKey !== null) domElement.haiku.key = incomingKey

  if (Array.isArray(virtualElement.children)) {
    renderTree(domElement, virtualElement, virtualElement.children, locator, hash, options, scopes, isPatchOperation)
  } else if (!virtualElement.children) {
    // In case of falsy virtual children, we still need to remove elements that were already there
    renderTree(domElement, virtualElement, [], locator, hash, options, scopes, isPatchOperation)
  }

  return domElement
}

module.exports = updateElement

var renderTree = require('./renderTree')
var updateSvgElement = require('./updateSvgElement')
var replaceElementWithText = require('./replaceElementWithText')
var replaceElement = require('./replaceElement')
var updateElement = require('./updateElement')
var normalizeName = require('./normalizeName')
var isTextNode = require('./isTextNode')
