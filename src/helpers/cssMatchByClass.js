var objectPath = require('./objectPath')

var CLASS_NAME_ATTR = 'class'
var ALT_CLASS_NAME_ATTR = 'className' // Ease of React integration
var SPACE = ' '

function matchByClass (node, className, options) {
  var attributes = objectPath(node, options.attributes)
  if (attributes) {
    var foundClassName = attributes[CLASS_NAME_ATTR]
    if (!foundClassName) foundClassName = attributes[ALT_CLASS_NAME_ATTR]
    if (foundClassName) {
      var classPieces = foundClassName.split(SPACE)
      if (classPieces.indexOf(className) !== -1) {
        return true
      }
    }
  }
}

module.exports = matchByClass
