var objectPath = require("./objectPath");
function matchByAttribute(node, attrKeyToMatch, attrOperator, attrValueToMatch, options) {
    var attributes = objectPath(node, options.attributes);
    if (attributes) {
        var attrValue = attributes[attrKeyToMatch];
        if (!attrOperator)
            return !!attrValue;
        switch (attrOperator) {
            case "=":
                return attrValueToMatch === attrValue;
            default:
                console.warn("Operator `" + attrOperator + "` not supported yet");
                return false;
        }
    }
}
module.exports = matchByAttribute;
