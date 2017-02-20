var createTextNode = require('./createTextNode')

function replaceElementWithText (domElement, textContent) {
  if (domElement) {
    if (domElement.textContent !== textContent) {
      var parentNode = domElement.parentNode
      var textNode = createTextNode(domElement, textContent)
      parentNode.replaceChild(textNode, domElement)
    }
  }
  return domElement
}

module.exports = replaceElementWithText
