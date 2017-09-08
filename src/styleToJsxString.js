var styleStringToObject = require('to-style').object

function styleToJSXString (style) {
  if (typeof style === 'string') style = styleStringToObject(style, { camelize: true })
  var out = '{' + JSON.stringify(style) + '}'
  return out
}

module.exports = styleToJSXString
