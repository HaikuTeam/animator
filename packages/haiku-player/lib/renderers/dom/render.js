var renderTree = require("./renderTree");
function render(domElement, virtualContainer, virtualTree, component) {
    return renderTree(domElement, virtualContainer, [virtualTree], component);
}
module.exports = render;
