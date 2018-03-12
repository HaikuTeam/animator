function getRelativeElementFromPoint (x, y, doc, domElement) {
  if (domElement) {
    const w = domElement.offsetWidth
    const h = domElement.offsetHeight
    if (x < w && x < h) {
      const rect = domElement.getBoundingClientRect()
      const top = rect.top
      const left = rect.left
      return doc.elementFromPoint(x + left, y + top)
    } else {
      return null
    }
  } else {
    return doc.elementFromPoint(x, y)
  }
}

module.exports = getRelativeElementFromPoint
