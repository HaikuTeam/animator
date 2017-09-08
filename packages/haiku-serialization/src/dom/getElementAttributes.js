var STYLE = 'style'

function getElementAttributes (el, maxAttributeLen) {
  var attrs = {}
  for (var i = 0, atts = el.attributes, n = atts.length; i < n; i++) {
    var val = atts[i].nodeValue
    var key = atts[i].nodeName
    if (key !== STYLE) {
      if (maxAttributeLen) {
        if (val.length <= maxAttributeLen) {
          attrs[key] = val
        }
      } else {
        attrs[key] = val
      }
    }
  }
  if (el[STYLE]) {
    attrs[STYLE] = clone(el[STYLE])
  }
  return attrs
}

function clone (style) {
  var out = {}
  if (!style) return out
  for (var i = 0, n = style.length; i < n; i++) {
    var key = style[i]
    var val = style[key]
    if (val !== '') out[key] = val
  }
  return out
}

module.exports = getElementAttributes
