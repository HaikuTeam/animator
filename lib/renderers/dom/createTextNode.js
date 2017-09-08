function createTextNode(domElement, textContent) {
    return domElement.ownerDocument.createTextNode(textContent);
}
module.exports = createTextNode;
