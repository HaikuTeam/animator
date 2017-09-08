var parseCode = require('./parseCode')
var traverseAST = require('./traverseAST')
var generateCode = require('./generateCode')

function remapSource (source, remapper) {
  if (!remapper) return source

  // Otherwise, scan for imports and replace them with the local to that lib
  var ast = parseCode(source)
  traverseAST(ast, function (node) {
    if (node.type === 'ImportDeclaration') {
      if (node.source && node.source.type === 'StringLiteral') {
        node.source.value = remapper(node.source.value)
      }
    } else if (node.type === 'CallExpression') {
      if (node.callee && node.callee.type === 'Identifier' && node.callee.name === 'require') {
        var dep = node.arguments[0]
        if (dep && dep.type === 'StringLiteral') {
          dep.value = remapper(dep.value)
        } else if (dep.type === 'TemplateLiteral') {
          var part = dep.quasis[0]
          if (part && part.value) {
            part.value.raw = remapper(part.value.raw)
          }
        }
      }
    }
  })

  var transformed = generateCode(ast)
  return transformed
}

module.exports = remapSource
