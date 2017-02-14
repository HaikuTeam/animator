function assignSvgAttributes (domElement, attributes) {
  for (var key in attributes) {
    var newValue = attributes[key]
    var previousValue = domElement.getAttribute(key)
    if (previousValue !== newValue) domElement.setAttribute(key, newValue)
  }
  return domElement
}

module.exports = assignSvgAttributes
