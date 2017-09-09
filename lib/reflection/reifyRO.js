"use strict";
exports.__esModule = true;
var expressionToRO_1 = require("./expressionToRO");
var reifyRFO_1 = require("./reifyRFO");
var isSerializableScalar_1 = require("./isSerializableScalar");
var OBJECT = "object";
var FUNCTION = "function";
function reifyRO(robj, referenceEvaluator, skipFunctions) {
    if (robj === undefined) {
        return undefined;
    }
    if (typeof robj === FUNCTION) {
        return reifyRO(expressionToRO_1["default"](robj, null), referenceEvaluator, skipFunctions);
    }
    if (isSerializableScalar_1["default"](robj)) {
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
            return reifyRFO_1["default"](robj.__function);
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
exports["default"] = reifyRO;
//# sourceMappingURL=reifyRO.js.map