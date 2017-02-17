var isBlankString = require('./isBlankString')
var removeElement = require('./removeElement')
var locatorBump = require('./locatorBump')

function renderTree (domElement, virtualElement, virtualChildren, locator, hash) {
  hash[locator] = domElement

  if (!domElement.haiku) domElement.haiku = {}
  domElement.haiku.locator = locator

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

    if (!virtualChild && !domChild) {
      continue
    } else if (!virtualChild && domChild) {
      removeElement(domChild)
      delete hash[sublocator]
    } else if (virtualChild && !domChild) {
      var insertedElement = appendChild(domElement, virtualChild, virtualElement, sublocator, hash)
      hash[sublocator] = insertedElement
    } else {
      modifyChild(domChild, virtualChild, domElement, virtualElement, sublocator, hash)
    }
  }

  return domElement
}

module.exports = renderTree

var appendChild = require('./appendChild')
var modifyChild = require('./modifyChild')
