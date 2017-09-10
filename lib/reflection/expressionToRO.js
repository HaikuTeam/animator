"use strict";
exports.__esModule = true;
var arrayToRO_1 = require("./arrayToRO");
var functionToRFO_1 = require("./functionToRFO");
var isSerializableScalar_1 = require("./isSerializableScalar");
var objectToRO_1 = require("./objectToRO");
var FUNCTION = "function";
var OBJECT = "object";
function expressionToRO(exp, options) {
    if (typeof exp === FUNCTION) {
        return functionToRFO_1["default"](exp);
    }
    if (Array.isArray(exp)) {
        return arrayToRO_1["default"](exp);
    }
    if (exp && typeof exp === OBJECT) {
        if (exp.__function || exp.__reference || exp.__value) {
            return exp;
        }
        return objectToRO_1["default"](exp, options);
    }
    if (isSerializableScalar_1["default"](exp)) {
        return exp;
    }
}
exports["default"] = expressionToRO;
//# sourceMappingURL=expressionToRO.js.map