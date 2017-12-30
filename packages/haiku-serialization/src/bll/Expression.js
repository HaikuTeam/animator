const BaseModel = require('./BaseModel')

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

Expression.retToEq = function retToEq (str) {
  if (str.substring(0, 7) === (Expression.EXPR_SIGNS.RET + ' ')) {
    str = str.slice(7)
    str = (Expression.EXPR_SIGNS.EQ + ' ') + str
  }
  return str
}

Expression.buildStateInjectorFunction = function buildStateInjectorFunction (stateName) {
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
