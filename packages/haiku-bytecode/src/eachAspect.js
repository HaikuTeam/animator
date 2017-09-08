var Aspects = require('./Aspects')

function eachAspect (bytecode, iteratee, binding) {
  for (var aspectName in Aspects) {
    // HACK: Fix the object if the aspect is not present
    if (!bytecode[aspectName]) bytecode[aspectName] = {}
    iteratee.call(binding, bytecode[aspectName], aspectName)
  }
}

module.exports = eachAspect
