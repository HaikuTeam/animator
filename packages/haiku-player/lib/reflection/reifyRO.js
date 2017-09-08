var OBJECT = "object";
var FUNCTION = "function";
function reifyRO(robj, referenceEvaluator, skipFunctions) {
    if (robj === undefined) {
        return undefined;
    }
    if (typeof robj === FUNCTION) {
        return reifyRO(expressionToRO(robj), referenceEvaluator, skipFunctions);
    }
    if (isSerializableScalar(robj)) {
        return robj;
    }
    if (Array.isArray(robj)) {
        var aout = [];
        for (var i = 0; i < robj.length; i++) {
            aout[i] = reifyRO(robj[i], referenceEvaluator, skipFunctions);
        }
        return aout;
    }
    if (typeof robj === OBJECT) {
        if (robj.__value !== undefined) {
            return reifyRO(robj.__value, referenceEvaluator, skipFunctions);
        }
        if (robj.__function) {
            if (skipFunctions)
                return robj;
            return reifyRFO(robj.__function);
        }
        if (robj.__reference) {
            if (referenceEvaluator)
                return referenceEvaluator(robj.__reference);
            throw new Error("Reference evaluator required");
        }
        var oout = {};
        for (var key in robj) {
            oout[key] = reifyRO(robj[key], referenceEvaluator, skipFunctions);
        }
        return oout;
    }
    return undefined;
}
module.exports = reifyRO;
var expressionToRO = require("./expressionToRO");
var reifyRFO = require("./reifyRFO");
var isSerializableScalar = require("./isSerializableScalar");
