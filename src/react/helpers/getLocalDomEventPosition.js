var getDomEventPosition = require('./getDomEventPosition')
var getDomNodeRect = require('./getDomNodeRect')

function getLocalDomEventPosition (event, element) {
  const doc = element.ownerDocument
  const viewPosition = getDomEventPosition(event, doc)
  const elementRect = getDomNodeRect(element)
  const x = viewPosition.x - elementRect.left
  const y = viewPosition.y - elementRect.top
  return {
    x: ~~x,
    y: ~~y
  }
}

module.exports = getLocalDomEventPosition
