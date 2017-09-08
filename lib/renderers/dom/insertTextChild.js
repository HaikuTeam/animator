var createTextNode = require("./createTextNode");
function insertTextChild(domElement, index, textContent) {
    var existingChild = domElement.childNodes[index];
    if (existingChild && existingChild.textContent === textContent) {
        return domElement;
    }
    if (existingChild) {
        var textNode = createTextNode(domElement, textContent);
        domElement.replaceChild(textNode, existingChild);
        return domElement;
    }
    return domElement;
}
module.exports = insertTextChild;
