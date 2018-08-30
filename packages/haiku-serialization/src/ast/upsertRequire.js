var _ = require('lodash')
var matchesRequire = require('./matchesRequire')

/**
 * @function upsertRequire
 * @description Given an AST object, an identifier name, and a module path,
 * _upsert_ a require statement at the top of the AST such that the output form would be:
 * var {identifierName} = require({modulePath}).
 * This should mutate the AST in place.
 */
module.exports = function upsertRequire (ast, identifierName, modulePath) {
  // TODO: Mutate line numbers so we don't end up with a bunch of nodes on the same line

  // we don't need a full traversal, since we know our require stmts are at the root
  var match = _.find(ast.program.body, function (stmt) {
    return matchesRequire(stmt, identifierName, modulePath)
  })

  if (match) {
    return null
  }

  ast.program.body.unshift({
    type: 'VariableDeclaration',
    kind: 'var',
    declarations: [{
      type: 'VariableDeclarator',
      id: {
        type: 'Identifier',
        name: identifierName
      },
      init: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'require'
        },
        arguments: [
          {
            type: 'StringLiteral',
            value: modulePath,
            extra: {
              raw: JSON.stringify(modulePath)
            }
          }
        ]
      }
    }]
  })
}
