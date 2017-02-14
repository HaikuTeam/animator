var SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

function createSvgElement (domElement, tagName) {
  return domElement.ownerDocument.createElementNS(SVG_NAMESPACE, tagName)
}

module.exports = createSvgElement
