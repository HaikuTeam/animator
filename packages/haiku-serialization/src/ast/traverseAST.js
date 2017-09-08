var traverse = require('babel-traverse').default

function traverseAST (ast, iterator) {
  traverse(ast, {
    enter (node) {
      iterator(node.node, node.parent)
    }
  })
}

module.exports = traverseAST
