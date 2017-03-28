function assignStyle (domElement, style, options, scopes) {
  for (var key in style) {
    var newProp = style[key]
    var previousProp = domElement.style[key]
    if (previousProp !== newProp) domElement.style[key] = style[key]
  }
  return domElement
}

module.exports = assignStyle
