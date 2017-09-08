var getDomEventPosition = require('./getDomEventPosition')

function getLocalDomEventPosition (event, element) {
  var doc = element.ownerDocument
  var viewPosition = getDomEventPosition(event, doc)
  var elementRect = element.getBoundingClientRect()
  var x = viewPosition.x - elementRect.left
  var y = viewPosition.y - elementRect.top
  return {
    x: ~~x,
    y: ~~y,
    pageX: viewPosition.x,
    pageY: viewPosition.y
  }
}

module.exports = getLocalDomEventPosition
