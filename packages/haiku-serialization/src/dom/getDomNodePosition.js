const BODY_TAGNAME = 'BODY'

function getDomNodePosition (domNode) {
  let x = 0
  let y = 0
  while (domNode) {
    if (domNode.tagName === BODY_TAGNAME) {
      let xScrollPos = domNode.scrollLeft || document.documentElement.scrollLeft
      let yScrollPos = domNode.scrollTop || document.documentElement.scrollTop
      x += (domNode.offsetLeft - xScrollPos + domNode.clientLeft)
      y += (domNode.offsetTop - yScrollPos + domNode.clientTop)
    } else {
      x += (domNode.offsetLeft - domNode.scrollLeft + domNode.clientLeft)
      y += (domNode.offsetTop - domNode.scrollTop + domNode.clientTop)
    }
    domNode = domNode.offsetParent
  }
  return {
    x: ~~x,
    y: ~~y
  }
}

module.exports = getDomNodePosition
