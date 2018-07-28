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

Expression.normalizeParsedValue = (parsedValue, propertyName) => {
  if (Number.isNaN(parsedValue)) {
    return 1
  }

  if (typeof parsedValue === 'number' && !isFinite(parsedValue)) {
    return 1
  }

  return parsedValue
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

  if (unit.match(/^rad/)) {
    return num
  }

  if (unit.match(/^deg/) || unit.match(/^°/)) {
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

  const parsedInput = State.flexibleJsonParse(userInput)

  // Don't allow functions; instead return the literal string in case someone
  // types words that match a known JavaScript constructor like Number, etc.
  if (typeof parsedInput === 'function') {
    return userInput
  }

  // Avoid inadvertently parsing known global objects like `window`, etc.
  if (parsedInput && !Array.isArray(parsedInput) && typeof parsedInput === 'object') {
    if (isPlainObject(parsedInput)) {
      return parsedInput
    }

    return userInput
  }

  if (parsedInput !== undefined) {
    return Expression.normalizeParsedValue(parsedInput, propertyName)
  }

  try {
    const inputAsTokens = tokenizeDirective(userInput).map(({value}) => value)

    if (Expression.TOKEN_HANDLERS[propertyName]) {
      return Expression.TOKEN_HANDLERS[propertyName](inputAsTokens, userInput)
    }

    if (typeof inputAsTokens[0] === 'number') {
      return Expression.normalizeParsedValue(inputAsTokens[0], propertyName)
    }
  } catch (exception) {
    return userInput
  }

  return userInput
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

const State = require('./State')
