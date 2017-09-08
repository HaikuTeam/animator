var createTextNode = require("./createTextNode");
var createTagNode = require("./createTagNode");
var applyLayout = require("./applyLayout");
var isTextNode = require("./isTextNode");
function appendChild(alreadyChildElement, virtualElement, parentDomElement, parentVirtualElement, component) {
    var domElementToInsert;
    if (isTextNode(virtualElement)) {
        domElementToInsert = createTextNode(parentDomElement, virtualElement, component);
    }
    else {
        domElementToInsert = createTagNode(parentDomElement, virtualElement, parentVirtualElement, component);
    }
    applyLayout(domElementToInsert, virtualElement, parentDomElement, parentVirtualElement, component);
    parentDomElement.appendChild(domElementToInsert);
    return domElementToInsert;
}
module.exports = appendChild;
