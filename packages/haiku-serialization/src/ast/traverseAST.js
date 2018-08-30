var traverse = require('@babel/traverse').default

function traverseAST (ast, iterator) {
  traverse(ast, {
    enter (path) {
      iterator(path.node, path.parent)
    }
  })
}

module.exports = traverseAST
