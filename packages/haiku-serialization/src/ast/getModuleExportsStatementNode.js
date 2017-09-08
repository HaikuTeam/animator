module.exports = function getModuleExportsStatementNode (ast) {
  var found
  ast.program.body.forEach((node) => {
    if (node.type === 'ExpressionStatement') {
      if (node.expression.type === 'AssignmentExpression') {
        if (node.expression.left.type === 'MemberExpression') {
          if (node.expression.left.object.name === 'module' && node.expression.left.property.name === 'exports') {
            found = node
          }
        }
      }
    }
  })
  return found
}
