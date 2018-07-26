const camelcase = require('camelcase')
const ReservedWords = require('@haiku/core/lib/reflection/ReservedWords').default
const BaseModel = require('./BaseModel')

const STR_ESC = '\''

function isNumeric (n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}

function safeJsonParse (str) {
  try {
    return JSON.parse(str)
  } catch (exception) {
    return undefined
  }
}

/**
 * @description Allow the user to enter strings like [{a: 123}] which aren't valid JSON
 * but which the JavaScript engine is able to parse.
 */
const flexibleJsonParse = (str) => {
  const body = `\nreturn ${str};\n`
  const fn = new Function(body) // eslint-disable-line no-new-func
  try {
    const out = fn()
    return out
  } catch (exception) {
    // no-op
  }

  return safeJsonParse(str)
}

function safeJsonStringify (thing) {
  try {
    return JSON.stringify(thing)
  } catch (exception) {
    if (thing && thing.toString) return thing.toString()
    return '' + thing + ''
  }
}

/**
 * @class State
 * @description
 *.  Collection of static class methods for logic related to states.
 */
class State extends BaseModel {}

State.DEFAULT_OPTIONS = {
  required: {}
}

BaseModel.extend(State)

function nextAvailableWordIfReserved (word) {
  if (ReservedWords.isReserved(word)) {
    return nextAvailableWordIfReserved(`_${word}`)
  }

  return word
}

State.buildStateNameFromElementPropertyName = function buildStateNameFromElementPropertyName (n, states, elementNode, propertyName, originalName) {
  let stateName = originalName

  const elementName = elementNode && elementNode.elementName

  if (!stateName) {
    if (elementName === 'path' && propertyName === 'd') {
      stateName = 'pathInstructions'
    }
  }

  if (!stateName) {
    stateName = camelcase(propertyName)
  }

  stateName = `${stateName.split(/\W+/g).join('_')}${(n && `_${n}`) || ''}`

  // Some state names may match JavaScript reserved words like in="", which
  // will result in syntax errors when injected into expressions
  stateName = nextAvailableWordIfReserved(stateName)

  if (!states[stateName]) {
    return stateName
  }

  return State.buildStateNameFromElementPropertyName(n + 1, states, elementNode, propertyName, originalName)
}

/**
 * @method areStatesEquivalent
 * @description Determines whether two state objects have the same properties
 * @returns {Boolean}
 */
State.areStatesEquivalent = function areStatesEquivalent (s1, s2) {
  if (!s1 && !s2) return true
  if (s1 && !s2) return false
  if (!s1 && s2) return false
  for (const k1 in s1) {
    if (s2[k1] === undefined) return false
  }
  for (const k2 in s2) {
    if (s1[k2] === undefined) return false
  }
  return true
}

State.deduceTypeOfValue = (stateValue) => {
  if (Array.isArray(stateValue)) return 'array'
  if (isNumeric(stateValue)) return 'number'
  if (stateValue && typeof stateValue === 'object') return 'object'
  if (stateValue === null || stateValue === undefined) return 'any'
  // See if the string looks like it's probably a JSON value and use that as the type
  if (typeof stateValue === 'string') {
    if (stateValue === 'undefined') return 'any'
    if (stateValue[0] === STR_ESC) return 'string' // Leading single-quote means use as string, no casting
    const parsedValue = flexibleJsonParse(stateValue)
    if (parsedValue === undefined) return 'string' // If we failed to parse, just assume a string
    if (typeof parsedValue === 'string') return 'string'
    return State.deduceTypeOfValue(parsedValue)
  }
  return typeof stateValue
}

State.deduceType = (stateValueDescriptor) => {
  if (stateValueDescriptor.type) return stateValueDescriptor.type
  return State.deduceTypeOfValue(stateValueDescriptor.value)
}

State.assignDescriptor = (out, stateValueDescriptor) => {
  if (stateValueDescriptor.setter) out.set = stateValueDescriptor.setter // Fix legacy naming
  if (stateValueDescriptor.getter) out.get = stateValueDescriptor.getter // Fix legacy naming
  if (stateValueDescriptor.set) out.set = stateValueDescriptor.set
  if (stateValueDescriptor.get) out.get = stateValueDescriptor.get
  if (stateValueDescriptor.type) out.type = stateValueDescriptor.type
  if (stateValueDescriptor.access) out.access = stateValueDescriptor.access
  if (stateValueDescriptor.mock !== undefined) out.mock = stateValueDescriptor.mock
  if (stateValueDescriptor.value !== undefined) out.value = stateValueDescriptor.value
  return out
}

State.castValueToType = (stateValue, desiredType) => {
  switch (desiredType) {
    case 'array':
      if (Array.isArray(stateValue)) return stateValue
      if (typeof stateValue === 'string') return State.castValueToType(flexibleJsonParse(stateValue), desiredType) // Recursive
      return [] // Probably the best we can do if we fail

    case 'object':
      if (stateValue && typeof stateValue === 'object') return stateValue
      if (typeof stateValue === 'string') return State.castValueToType(flexibleJsonParse(stateValue), desiredType) // Recursive
      return {} // Probably the best we can do if we fail

    case 'number':
      var stateAsNumber = Number(stateValue)
      if (isNumeric(stateAsNumber)) return stateAsNumber
      return 0 // Probably the best we can do if we fail

    case 'boolean':
      if (typeof stateValue === 'boolean') return stateValue
      if (stateValue === 'true') return true
      if (stateValue === 'false') return false
      return !!stateValue

    case 'string':
      if (typeof stateValue === 'string') return stateValue
      if (!stateValue) return ''
      return safeJsonStringify(stateValue)

    default: // 'any'/'*'
      if (stateValue === 'null') return null
      if (stateValue === 'undefined') return null
      if (stateValue === null) return null
      if (stateValue === undefined) return null
      return stateValue
  }
}

State.castToType = (stateValueDescriptor, desiredType) => {
  const newDescriptor = State.assignDescriptor({}, stateValueDescriptor)
  if (desiredType !== undefined) newDescriptor.type = desiredType // Lock the type by setting the type field
  newDescriptor.value = State.castValueToType(stateValueDescriptor.value, desiredType)
  if (stateValueDescriptor.mock !== undefined) {
    newDescriptor.mock = State.castValueToType(stateValueDescriptor.mock, desiredType)
  }
  return newDescriptor
}

State.autoCastToType = (stateValueDescriptor) => {
  const deducedType = State.deduceType(stateValueDescriptor)
  return State.castToType(stateValueDescriptor, deducedType)
}

State.autoStringify = (stateValueDescriptor) => {
  const deducedType = State.deduceType(stateValueDescriptor)
  return State.stringifyFromType(stateValueDescriptor.value, deducedType)
}

State.stringifyFromType = (stateValue, knownType) => {
  if (typeof stateValue === 'string') return stateValue // Use string if already a string
  switch (knownType) {
    case 'array':
      return safeJsonStringify(stateValue)
    case 'object':
      return safeJsonStringify(stateValue)
    default: // booleans, numbers, strings, and empty values
      if (stateValue && stateValue.toString) return stateValue.toString()
      if (stateValue === null) return ''
      if (stateValue === undefined) return ''
      return '' + stateValue + ''
  }
}

module.exports = State
