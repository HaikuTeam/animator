var functionSpecificationToFunction = require('./functionSpecificationToFunction')

function reifyRFO (rfo) {
  var fn = functionSpecificationToFunction(rfo.name || '', rfo.params, rfo.body, rfo.type)
  return fn
}

module.exports = reifyRFO
