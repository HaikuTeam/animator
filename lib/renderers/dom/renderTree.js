var isBlankString = require("./isBlankString");
var removeElement = require("./removeElement");
var cloneVirtualElement = require("./cloneVirtualElement");
var getFlexId = require("./getFlexId");
var shouldElementBeReplaced = require("./shouldElementBeReplaced");
function renderTree(domElement, virtualElement, virtualChildren, component, isPatchOperation, doSkipChildren) {
    component._addElementToHashTable(domElement, virtualElement);
    if (!domElement.haiku)
        domElement.haiku = {};
    virtualElement.__target = domElement;
    domElement.haiku.virtual = virtualElement;
    domElement.haiku.element = cloneVirtualElement(virtualElement);
    if (!component.config.options.cache[getFlexId(virtualElement)]) {
        component.config.options.cache[getFlexId(virtualElement)] = {};
    }
    if (!Array.isArray(virtualChildren)) {
        return domElement;
    }
    if (component._isHorizonElement(virtualElement)) {
        return domElement;
    }
    if (doSkipChildren) {
        return domElement;
    }
    while (virtualChildren.length > 0 && isBlankString(virtualChildren[0])) {
        virtualChildren.shift();
    }
    var domChildNodes = [];
    for (var k = 0; k < domElement.childNodes.length; k++) {
        domChildNodes[k] = domElement.childNodes[k];
    }
    var max = virtualChildren.length;
    if (max < domChildNodes.length) {
        max = domChildNodes.length;
    }
    for (var i = 0; i < max; i++) {
        var virtualChild = virtualChildren[i];
        var domChild = domChildNodes[i];
        if (!virtualChild && !domChild) {
        }
        else if (!virtualChild && domChild) {
            removeElement(domChild);
        }
        else if (virtualChild) {
            if (!domChild) {
                var insertedElement = appendChild(null, virtualChild, domElement, virtualElement, component);
                component._addElementToHashTable(insertedElement, virtualChild);
            }
            else {
                if (shouldElementBeReplaced(domChild, virtualChild)) {
                    replaceElement(domChild, virtualChild, domElement, virtualElement, component);
                }
                else {
                    updateElement(domChild, virtualChild, domElement, virtualElement, component, isPatchOperation);
                }
            }
        }
    }
    return domElement;
}
module.exports = renderTree;
var appendChild = require("./appendChild");
var updateElement = require("./updateElement");
var replaceElement = require("./replaceElement");
