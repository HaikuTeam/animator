var createJsxAttributesObject = require('./createJsxAttributesObject')
var createJsxChildrenArray = require('./createJsxChildrenArray')

function createJsxElementNode (name, attributes, childJsxNodes) {
  return {
    type: 'JSXElement',
    openingElement: {
      type: 'JSXOpeningElement',
      name: {
        type: 'JSXIdentifier',
        name: name
      },
      attributes: createJsxAttributesObject(attributes)
    },
    closingElement: {
      type: 'JSXClosingElement',
      name: {
        type: 'JSXIdentifier',
        name: name
      }
    },
    children: createJsxChildrenArray(childJsxNodes)
  }
}

module.exports = createJsxElementNode
