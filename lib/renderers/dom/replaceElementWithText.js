var createTextNode = require("./createTextNode");
function replaceElementWithText(domElement, textContent, component) {
    if (domElement) {
        if (domElement.textContent !== textContent) {
            var parentNode = domElement.parentNode;
            var textNode = createTextNode(domElement, textContent, component);
            parentNode.replaceChild(textNode, domElement);
        }
    }
    return domElement;
}
module.exports = replaceElementWithText;
