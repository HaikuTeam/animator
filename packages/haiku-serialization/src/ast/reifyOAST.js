var OASTToRO = require('./OASTToRO')
var reifyRO = require('@haiku/core/lib/reflection/reifyRO').default

function reifyOAST (oast, referenceEvaluator, skipFunctionReification) {
  var ro = OASTToRO(oast)
  return reifyRO(ro, referenceEvaluator, skipFunctionReification)
}

module.exports = reifyOAST
