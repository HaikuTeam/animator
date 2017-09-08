function getRelativeElementFromPoint (x, y, doc, context) {
  if (context) {
    var w = context.offsetWidth
    var h = context.offsetHeight
    if (x < w && x < h) {
      var rect = context.getBoundingClientRect()
      var top = rect.top
      var left = rect.left
      return doc.elementFromPoint(x + left, y + top)
    } else {
      return null
    }
  } else {
    return doc.elementFromPoint(x, y)
  }
}

module.exports = getRelativeElementFromPoint
