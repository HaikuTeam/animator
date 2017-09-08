var OASTToRO = require('./OASTToRO')
var reifyRO = require('@haiku/player/lib/reflection/reifyRO')

function reifyOAST (oast, referenceEvaluator, skipFunctionReification) {
  var ro = OASTToRO(oast)
  return reifyRO(ro, referenceEvaluator, skipFunctionReification)
}

module.exports = reifyOAST
