var STR_ESC = '\''

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

function safeJsonStringify (thing) {
  try {
    return JSON.stringify(thing)
  } catch (exception) {
    if (thing && thing.toString) return thing.toString()
    return '' + thing + ''
  }
}

function deduceTypeOfValue (stateValue) {
  if (Array.isArray(stateValue)) return 'array'
  if (isNumeric(stateValue)) return 'number'
  if (stateValue && typeof stateValue === 'object') return 'object'
  if (stateValue === null || stateValue === undefined) return 'any'
  // See if the string looks like it's probably a JSON value and use that as the type
  if (typeof stateValue === 'string') {
    if (stateValue === 'undefined') return 'any'
    if (stateValue[0] === STR_ESC) return 'string' // Leading single-quote means use as string, no casting
    var parsedValue = safeJsonParse(stateValue)
    if (parsedValue === undefined) return 'string' // If we failed to parse, just assume a string
    if (typeof parsedValue === 'string') return 'string'
    return deduceTypeOfValue(parsedValue)
  }
  return typeof stateValue
}

function deduceType (stateValueDescriptor) {
  if (stateValueDescriptor.type) return stateValueDescriptor.type
  return deduceTypeOfValue(stateValueDescriptor.value)
}

function assignDescriptor (out, stateValueDescriptor) {
  if (stateValueDescriptor.setter) out.set = stateValueDescriptor.setter // Fix legacy naming
  if (stateValueDescriptor.getter) out.get = stateValueDescriptor.getter // Fix legacy naming
  if (stateValueDescriptor.set) out.set = stateValueDescriptor.set
  if (stateValueDescriptor.get) out.get = stateValueDescriptor.get
  if (stateValueDescriptor.type) out.type = stateValueDescriptor.type
  if (stateValueDescriptor.mock !== undefined) out.mock = stateValueDescriptor.mock
  if (stateValueDescriptor.value !== undefined) out.value = stateValueDescriptor.value
  return out
}

function castValueToType (stateValue, desiredType) {
  switch (desiredType) {
    case 'array':
      if (Array.isArray(stateValue)) return stateValue
      if (typeof stateValue === 'string') return castValueToType(safeJsonParse(stateValue), desiredType) // Recursive
      return [] // Probably the best we can do if we fail

    case 'object':
      if (stateValue && typeof stateValue === 'object') return stateValue
      if (typeof stateValue === 'string') return castValueToType(safeJsonParse(stateValue), desiredType) // Recursive
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

function castToType (stateValueDescriptor, desiredType) {
  var newDescriptor = assignDescriptor({}, stateValueDescriptor)
  if (desiredType !== undefined) newDescriptor.type = desiredType // Lock the type by setting the type field
  newDescriptor.value = castValueToType(stateValueDescriptor.value, desiredType)
  if (stateValueDescriptor.mock !== undefined) {
    newDescriptor.mock = castValueToType(stateValueDescriptor.mock, desiredType)
  }
  return newDescriptor
}

function autoCastToType (stateValueDescriptor) {
  var deducedType = deduceType(stateValueDescriptor)
  return castToType(stateValueDescriptor, deducedType)
}

function autoStringify (stateValueDescriptor) {
  var deducedType = deduceType(stateValueDescriptor)
  return stringifyFromType(stateValueDescriptor.value, deducedType)
}

function stringifyFromType (stateValue, knownType) {
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

module.exports = {
  autoStringify: autoStringify,
  stringifyFromType: stringifyFromType,
  autoCastToType: autoCastToType,
  castToType: castToType,
  castValueToType: castValueToType,
  assignDescriptor: assignDescriptor,
  deduceType: deduceType,
  deduceTypeOfValue: deduceTypeOfValue
}
