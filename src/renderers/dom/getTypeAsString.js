var STRING = 'string'
var FUNCTION = 'function'

function getType (virtualElement) {
  var typeValue = virtualElement.elementName
  if (typeValue && typeValue.default) return typeValue.default
  return typeValue
}

function thingToTagName (thing) {
  if (!thing) return '__void__' // TODO: What should happen here?
  if (typeof thing === STRING) return thing
  if (typeof thing === FUNCTION) return fnToTagName(thing)
  return '__void__'
}

function fnToTagName (fn) {
  if (fn.name) return fn.name
  if (fn.displayName) return fn.displayName
  if (fn.constructor) {
    if (fn.constructor.name !== 'Function') {
      return fn.constructor.name
    }
  }
}

function getTypeAsString (virtualElement) {
  var typeValue = getType(virtualElement)
  if (!typeValue) throw new Error('Cannot get node name from blank object')
  typeValue = thingToTagName(typeValue)
  if (!typeValue) throw new Error('Node has no discernable name')
  return typeValue
}

module.exports = getTypeAsString
