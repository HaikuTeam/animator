const expressionToRO = require('@haiku/core/lib/reflection/expressionToRO').default

module.exports = (value) => {
  return expressionToRO(value)
}
