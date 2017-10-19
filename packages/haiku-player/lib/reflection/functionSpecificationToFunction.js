"use strict";
exports.__esModule = true;
var marshalParams_1 = require("./marshalParams");
function functionSpecificationToFunction(name, params, body, type) {
    if (type === void 0) { type = 'FunctionExpression'; }
    var fn;
    if (type === 'ArrowFunctionExpression') {
        fn = new Function('\n' +
            'return ' +
            (name || '') +
            '(' +
            marshalParams_1["default"](params) +
            ') => {\n' +
            '  ' +
            (body || '') +
            '\n' +
            '}\n')();
    }
    else {
        fn = new Function('\n' +
            'return function ' +
            (name || '') +
            '(' +
            marshalParams_1["default"](params) +
            ') {\n' +
            '  ' +
            (body || '') +
            '\n' +
            '}\n')();
    }
    return fn;
}
exports["default"] = functionSpecificationToFunction;
//# sourceMappingURL=functionSpecificationToFunction.js.map