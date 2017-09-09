"use strict";
exports.__esModule = true;
var marshalParams_1 = require("./marshalParams");
function functionSpecificationToFunction(name, params, body, type) {
    if (!type)
        type = "FunctionExpression";
    params = marshalParams_1["default"](params);
    var fn;
    if (type === "ArrowFunctionExpression") {
        fn = new Function("\n" +
            "return " +
            (name || "") +
            "(" +
            params +
            ") => {\n" +
            "  " +
            (body || "") +
            "\n" +
            "}\n")();
    }
    else {
        fn = new Function("\n" +
            "return function " +
            (name || "") +
            "(" +
            params +
            ") {\n" +
            "  " +
            (body || "") +
            "\n" +
            "}\n")();
    }
    return fn;
}
exports["default"] = functionSpecificationToFunction;
//# sourceMappingURL=functionSpecificationToFunction.js.map