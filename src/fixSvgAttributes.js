var camelcase = require('camelcase')

function fixSvgAttributes (attributes, options) {
  var fixed = {}
  for (var key in attributes) {
    if (key.indexOf(':') !== -1) continue // No namespace attributes in React

    if (options && options.camelize) {
      fixed[camelcase(key)] = attributes[key]
    } else {
      fixed[key] = attributes[key]
    }
  }
  return fixed
}

module.exports = fixSvgAttributes
