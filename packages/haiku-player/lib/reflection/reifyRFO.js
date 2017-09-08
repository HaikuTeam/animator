var inject = require("./inject");
var functionSpecificationToFunction = require("./functionSpecificationToFunction");
function reifyRFO(rfo) {
    var fn = functionSpecificationToFunction(rfo.name || "", rfo.params, rfo.body, rfo.type);
    if (rfo.injectee) {
        inject.apply(null, [fn].concat(rfo.params));
    }
    return fn;
}
module.exports = reifyRFO;
