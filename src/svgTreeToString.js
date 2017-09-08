var manaToHtml = require('./manaToHtml')

function svgTreeToString (obj, options) {
  return manaToHtml('', obj, {
    name: 'elementName',
    attributes: 'attributes',
    children: 'children'
  }, options)
}

module.exports = svgTreeToString
