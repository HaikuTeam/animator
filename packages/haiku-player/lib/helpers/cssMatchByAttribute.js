"use strict";
exports.__esModule = true;
var objectPath_1 = require("./objectPath");
function matchByAttribute(node, attrKeyToMatch, attrOperator, attrValueToMatch, options) {
    var attributes = objectPath_1["default"](node, options.attributes);
    if (attributes) {
        var attrValue = attributes[attrKeyToMatch];
        if (!attrOperator) {
            return !!attrValue;
        }
        switch (attrOperator) {
            case '=':
                return attrValueToMatch === attrValue;
            default:
                console.warn('Operator `' + attrOperator + '` not supported yet');
                return false;
        }
    }
}
exports["default"] = matchByAttribute;
//# sourceMappingURL=cssMatchByAttribute.js.map