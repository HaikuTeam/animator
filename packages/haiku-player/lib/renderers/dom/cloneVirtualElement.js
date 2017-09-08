function cloneVirtualElement(virtualElement) {
    return {
        elementName: virtualElement.elementName,
        attributes: cloneAttributes(virtualElement.attributes),
        children: virtualElement.children
    };
}
module.exports = cloneVirtualElement;
var cloneAttributes = require("./cloneAttributes");
