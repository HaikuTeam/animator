const BaseModel = require('./BaseModel')
const {tokenizeDirective} = require('@haiku/core/lib/reflection/Tokenizer')

/**
 * @class Expression
 * @description
 *.  Collection of static class methods for Expression-related logic.
 */
class Expression extends BaseModel {}

Expression.DEFAULT_OPTIONS = {
  required: {}
}

BaseModel.extend(Expression)

Expression.EXPR_SIGNS = {
  RET: 'return',
  EQ: '='
}

Expression.retToEq = (str) => {
  if (str.substring(0, 7) === (Expression.EXPR_SIGNS.RET + ' ')) {
    str = str.slice(7)
    str = (Expression.EXPR_SIGNS.EQ + ' ') + str
  }
  return str
}

const textContentNormalizer = (value) => {
  if (typeof value === 'string') {
    return value
  }

  if (typeof value === 'number') {
    return value
  }

  if (value === null || value === undefined) {
    return ''
  }

  return value + ''
}

const booleanNormalizer = (value) => {
  return !!value
}

const numericNormalizer = (value) => {
  return Number(value)
}

Expression.VALUE_NORMALIZERS = {
  'content': textContentNormalizer,
  'shown': booleanNormalizer,
  'opacity': numericNormalizer,
  'offset.x': numericNormalizer,
  'offset.y': numericNormalizer,
  'offset.z': numericNormalizer,
  'origin.x': numericNormalizer,
  'origin.y': numericNormalizer,
  'origin.z': numericNormalizer,
  'translation.x': numericNormalizer,
  'translation.y': numericNormalizer,
  'translation.z': numericNormalizer,
  'rotation.x': numericNormalizer,
  'rotation.y': numericNormalizer,
  'rotation.z': numericNormalizer,
  'scale.x': numericNormalizer,
  'scale.y': numericNormalizer,
  'scale.z': numericNormalizer,
  'shear.xy': numericNormalizer,
  'shear.xz': numericNormalizer,
  'shear.yz': numericNormalizer,
  'sizeMode.x': numericNormalizer,
  'sizeMode.y': numericNormalizer,
  'sizeMode.z': numericNormalizer,
  'sizeProportional.x': numericNormalizer,
  'sizeProportional.y': numericNormalizer,
  'sizeProportional.z': numericNormalizer,
  'sizeDifferential.x': numericNormalizer,
  'sizeDifferential.y': numericNormalizer,
  'sizeDifferential.z': numericNormalizer,
  'sizeAbsolute.x': numericNormalizer,
  'sizeAbsolute.y': numericNormalizer,
  'sizeAbsolute.z': numericNormalizer
}

Expression.isUnitToken = (str) => {
  return (
    Expression.isPxUnit(str) ||
    Expression.isRadiansUnit(str) ||
    Expression.isDegreesUnit(str)
  )
}

Expression.normalizeTokensWithNumericFirstToken = (tokens, orig) => {
  // We assume the first token is already known to be a numbers
  if (tokens.length < 2) {
    return tokens[0]
  }

  // Assume we have a string like '99 bottles of beer on the wall'
  if (tokens.length > 2) {
    return orig
  }

  if (Expression.isUnitToken(tokens[1])) {
    return tokens[0]
  }

  return orig
}

Expression.normalizeParsedValue = (parsedValue, propertyName) => {
  if (Number.isNaN(parsedValue)) {
    return 1
  }

  if (typeof parsedValue === 'number' && !isFinite(parsedValue)) {
    return 1
  }

  if (Expression.VALUE_NORMALIZERS[propertyName]) {
    return Expression.VALUE_NORMALIZERS[propertyName](parsedValue)
  }

  return parsedValue
}

Expression.isRadiansUnit = (unit) => {
  return unit === 'rad' || unit === 'rads' || unit === 'radians'
}

Expression.isDegreesUnit = (unit) => {
  return unit === 'deg' || unit === 'degs' || unit === 'degrees' || unit === '°'
}

Expression.isPxUnit = (unit) => {
  return unit === 'px' || unit === 'pixels'
}

const rotationTokenHandler = (tokens, raw) => {
  if (tokens.length < 1) {
    return 1
  }

  const num = Expression.normalizeParsedValue(Number(tokens[0]))
  const unit = tokens[1]

  if (typeof unit !== 'string') {
    return num
  }

  if (Expression.isRadiansUnit(unit)) {
    return num
  }

  if (Expression.isDegreesUnit(unit)) {
    return num * (Math.PI / 180)
  }

  return num
}

const pxTokenHandler = (tokens, raw) => {
  if (tokens.length < 1) {
    return 1
  }

  // For now, assume all values have a unit of 'px'
  const num = Expression.normalizeParsedValue(Number(tokens[0]))
  return num
}

Expression.TOKEN_HANDLERS = {
  'rotation.x': rotationTokenHandler,
  'rotation.y': rotationTokenHandler,
  'rotation.z': rotationTokenHandler,
  'translation.x': pxTokenHandler,
  'translation.y': pxTokenHandler,
  'translation.z': pxTokenHandler,
  'sizeAbsolute.x': pxTokenHandler,
  'sizeAbsolute.y': pxTokenHandler,
  'width': pxTokenHandler,
  'height': pxTokenHandler
}

const isPlainObject = (obj) => {
  return (
    obj.constructor === Object && // separate instances (Array, DOM, ...)
    Object.prototype.toString.call(obj) === '[object Object]' // separate build-in like Math
  )
}

Expression.parseValue = (userInput, propertyName) => {
  // Assume any non-string input (numbers, objects) has been pre-parsed
  if (typeof userInput !== 'string') {
    return Expression.normalizeParsedValue(userInput, propertyName)
  }

  const parsedInput = Expression.flexibleJsonParse(userInput)

  // Don't allow functions; instead return the literal string in case someone
  // types words that match a known JavaScript constructor like Number, etc.
  if (typeof parsedInput === 'function') {
    return Expression.normalizeParsedValue(userInput)
  }

  // Avoid inadvertently parsing known global objects like `window`, etc.
  if (parsedInput && !Array.isArray(parsedInput) && typeof parsedInput === 'object') {
    if (isPlainObject(parsedInput)) {
      return Expression.normalizeParsedValue(parsedInput)
    }

    return Expression.normalizeParsedValue(userInput)
  }

  if (parsedInput !== undefined) {
    return Expression.normalizeParsedValue(parsedInput, propertyName)
  }

  try {
    const inputAsTokens = tokenizeDirective(userInput).map(({value}) => value)

    if (Expression.TOKEN_HANDLERS[propertyName]) {
      return Expression.normalizeParsedValue(
        Expression.TOKEN_HANDLERS[propertyName](inputAsTokens, userInput)
      )
    }

    if (typeof inputAsTokens[0] === 'number') {
      return Expression.normalizeParsedValue(
        Expression.normalizeTokensWithNumericFirstToken(inputAsTokens, userInput),
        propertyName
      )
    }
  } catch (exception) {
    return Expression.normalizeParsedValue(userInput)
  }

  return Expression.normalizeParsedValue(userInput)
}

Expression.safeJsonParse = (str) => {
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
Expression.flexibleJsonParse = (str) => {
  const body = `\nreturn ${str.trim()};\n`
  try {
    const fn = new Function(body) // eslint-disable-line no-new-func
    const out = fn()
    return out
  } catch (exception) {
    // no-op
  }

  return Expression.safeJsonParse(str)
}

Expression.buildStateInjectorFunction = (stateName) => {
  // The AST/serialization utilities will handle:
  //  - Converting this into a proper function node
  //  - Wrapping that function node in a Haiku.inject
  return {
    __function: {
      params: [stateName],
      body: `return ${stateName};`,
      injectee: true // Important: Used when reconstituting bytecode after component instantiation
    }
  }
}

module.exports = Expression
