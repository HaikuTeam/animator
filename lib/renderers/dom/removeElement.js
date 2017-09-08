function removeElement(domElement) {
    domElement.parentNode.removeChild(domElement);
    return domElement;
}
module.exports = removeElement;
