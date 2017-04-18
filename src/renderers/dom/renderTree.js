var isBlankString = require('./isBlankString')
var removeElement = require('./removeElement')
var locatorBump = require('./locatorBump')

function renderTree (domElement, virtualElement, virtualChildren, locator, hash, options, scopes) {
  hash[locator] = domElement

  if (!domElement.haiku) domElement.haiku = {}
  domElement.haiku.locator = locator
  domElement.haiku.element = virtualElement

  if (!Array.isArray(virtualChildren)) {
    return domElement
  }

  while (virtualChildren.length > 0 && isBlankString(virtualChildren[0])) {
    virtualChildren.shift()
  }

  var max = virtualChildren.length
  if (max < domElement.childNodes.length) max = domElement.childNodes.length

  for (var i = 0; i < max; i++) {
    var virtualChild = virtualChildren[i]
    var domChild = domElement.childNodes[i]
    var sublocator = locatorBump(locator, i)

    if (virtualChild && options.modifier) {
      var virtualReplacement = options.modifier(virtualChild)
      if (virtualReplacement !== undefined) {
        virtualChild = virtualReplacement
      }
    }

    if (!virtualChild && !domChild) {
      continue
    } else if (!virtualChild && domChild) {
      removeElement(domChild, hash, options, scopes)
      delete hash[sublocator]
    } else if (virtualChild && !domChild) {
      var insertedElement = appendChild(null, virtualChild, domElement, virtualElement, sublocator, hash, options, scopes)
      hash[sublocator] = insertedElement
    } else {
      if (!domChild.haiku) domChild.haiku = {}
      domChild.haiku.locator = sublocator
      if (!domChild.haiku.element) domChild.haiku.element = virtualChild
      modifyChild(domChild, virtualChild, domElement, virtualElement, sublocator, hash, options, scopes)
    }
  }

  return domElement
}

module.exports = renderTree

var appendChild = require('./appendChild')
var modifyChild = require('./modifyChild')
var replaceElement = require('./replaceElement')
