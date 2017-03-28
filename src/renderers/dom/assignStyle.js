function assignStyle (domElement, style, options, scopes) {
  if (!domElement.__haikuExplicitStyles) domElement.__haikuExplicitStyles = {}
  for (var key in style) {
    var newProp = style[key]
    var previousProp = domElement.style[key]
    if (previousProp !== newProp) {
      domElement.__haikuExplicitStyles[key] = true
      domElement.style[key] = style[key]
    }
  }
  return domElement
}

module.exports = assignStyle
