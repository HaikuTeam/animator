var STRING = 'string'
var FUNCTION = 'function'

function getType (virtualElement) {
  var typeValue = virtualElement.elementName
  if (typeValue && typeValue.default) return typeValue.default
  return typeValue
}

function thingToTagName (thing) {
  if (typeof thing === STRING && thing.length > 0) return thing
  if (typeof thing === FUNCTION) return fnToTagName(thing)
  _warnOnce('Got blank/malformed virtual element object; falling back to <div>')
  return 'div'
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
  typeValue = thingToTagName(typeValue)
  if (!typeValue) throw new Error('Node has no discernable name')
  return typeValue
}

var warnings = {}
function _warnOnce (warning) {
  if (warnings[warning]) return void (0)
  warnings[warning] = true
  console.warn('[haiku player] warning:', warning)
}

module.exports = getTypeAsString
