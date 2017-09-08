var reifyRO = require('@haiku/player/src/reflection/reifyRO')

var DO_REIFY_FUNCTIONS = true

// TODO: There might be cases where somebody's added a keyframe value whose intent is to be a reference, i.e. a
// variable referencing something defined in closure. We can possibly handle that in the future in some cases...
function referenceEvaluator (arg) {
  console.warn('[bytecode] reference evaluator is not implemented')
  return arg
}

// We may have gotten the serialized form of a value, especially in the case of a function expression/formula, so we have to
// convert its serialized form into the reified form, i.e. the 'real' value we want to write to the user's code file
module.exports = function unserValue (value) {
  // (The function expects the inverse of the setting)
  var skipFunctions = !DO_REIFY_FUNCTIONS
  return reifyRO(value, referenceEvaluator, skipFunctions)
}
