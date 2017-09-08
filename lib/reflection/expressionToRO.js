var FUNCTION = "function";
var OBJECT = "object";
function expressionToRO(exp, options) {
    if (typeof exp === FUNCTION) {
        return functionToRFO(exp);
    }
    if (Array.isArray(exp)) {
        return arrayToRO(exp);
    }
    if (exp && typeof exp === OBJECT) {
        if (exp.__function || exp.__reference || exp.__value) {
            return exp;
        }
        return objectToRO(exp, options);
    }
    if (isSerializableScalar(exp)) {
        return exp;
    }
}
module.exports = expressionToRO;
var isSerializableScalar = require("./isSerializableScalar");
var objectToRO = require("./objectToRO");
var functionToRFO = require("./functionToRFO");
var arrayToRO = require("./arrayToRO");
