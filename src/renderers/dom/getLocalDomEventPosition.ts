let getDomEventPosition = require("./getDomEventPosition")

function getLocalDomEventPosition(event, element) {
  let doc = element.ownerDocument
  let viewPosition = getDomEventPosition(event, doc)
  let elementRect = element.getBoundingClientRect()
  let x = viewPosition.x - elementRect.left
  let y = viewPosition.y - elementRect.top
  return {
    x: ~~x,
    y: ~~y,
    pageX: viewPosition.x,
    pageY: viewPosition.y,
  }
}

module.exports = getLocalDomEventPosition
