var applyLayout = require("./applyLayout");
var assignAttributes = require("./assignAttributes");
var getTypeAsString = require("./getTypeAsString");
var cloneVirtualElement = require("./cloneVirtualElement");
var getFlexId = require("./getFlexId");
var OBJECT = "object";
var STRING = "string";
function updateElement(domElement, virtualElement, parentNode, parentVirtualElement, component, isPatchOperation) {
    if (isTextNode(virtualElement, component)) {
        replaceElementWithText(domElement, virtualElement, component);
        return virtualElement;
    }
    if (!domElement.haiku)
        domElement.haiku = {};
    if (!component.config.options.cache[getFlexId(virtualElement)]) {
        component.config.options.cache[getFlexId(virtualElement)] = {};
    }
    if (!domElement.haiku.element) {
        domElement.haiku.element = cloneVirtualElement(virtualElement);
    }
    var domTagName = domElement.tagName.toLowerCase().trim();
    var elName = normalizeName(getTypeAsString(virtualElement));
    var virtualElementTagName = elName.toLowerCase().trim();
    var incomingKey = virtualElement.key ||
        (virtualElement.attributes && virtualElement.attributes.key);
    var existingKey = domElement.haiku && domElement.haiku.key;
    var isKeyDifferent = incomingKey !== null &&
        incomingKey !== undefined &&
        incomingKey !== existingKey;
    if (!component._isHorizonElement(virtualElement)) {
        if (domTagName !== virtualElementTagName) {
            return replaceElement(domElement, virtualElement, parentNode, parentVirtualElement, component);
        }
        if (isKeyDifferent) {
            return replaceElement(domElement, virtualElement, parentNode, parentVirtualElement, component);
        }
    }
    if (virtualElement.attributes &&
        typeof virtualElement.attributes === OBJECT) {
        assignAttributes(domElement, virtualElement, component, isPatchOperation, isKeyDifferent);
    }
    applyLayout(domElement, virtualElement, parentNode, parentVirtualElement, component, isPatchOperation, isKeyDifferent);
    if (incomingKey !== undefined && incomingKey !== null) {
        domElement.haiku.key = incomingKey;
    }
    var subcomponent = (virtualElement && virtualElement.__instance) || component;
    if (Array.isArray(virtualElement.children)) {
        var doSkipChildren = isPatchOperation && (typeof virtualElement.children[0] !== STRING);
        renderTree(domElement, virtualElement, virtualElement.children, subcomponent, isPatchOperation, doSkipChildren);
    }
    else if (!virtualElement.children) {
        renderTree(domElement, virtualElement, [], subcomponent, isPatchOperation);
    }
    return domElement;
}
module.exports = updateElement;
var renderTree = require("./renderTree");
var replaceElementWithText = require("./replaceElementWithText");
var replaceElement = require("./replaceElement");
var normalizeName = require("./normalizeName");
var isTextNode = require("./isTextNode");
