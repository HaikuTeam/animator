var COLON = ':'
var SEMI = ';'

function styleToString (style) {
  var out = ''
  if (!style) return out
  if (typeof style === 'string') return style
  if (typeof style !== 'object') return out
  for (var styleKey in style) {
    var styleValue = style[styleKey]
    // TODO: Add correct spacing instead of this compact format?
    out += styleKey + COLON + styleValue + SEMI
  }
  return out
}

module.exports = styleToString
