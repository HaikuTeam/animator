const objectToOAST = require('./objectToOAST');

function buildRequireStatement (identifier, modpath) {
  return {
    type: 'VariableDeclaration',
    kind: 'var',
    declarations: [{
      type: 'VariableDeclarator',
      id: {
        type: 'Identifier',
        name: identifier,
      },
      init: {
        type: 'CallExpression',
        callee: {
          type: 'Identifier',
          name: 'require',
        },
        arguments: [{
          type: 'StringLiteral',
          value: modpath,
          extra: {
            raw: JSON.stringify(modpath),
          },
        }],
      },
    }],
  };
}

function buildRequireStatementsFromImports (imports) {
  const statements = [buildRequireStatement('Haiku', '@haiku/core')];
  for (const modpath in imports) {
    const identifier = imports[modpath];
    statements.push(buildRequireStatement(identifier, modpath));
  }
  return statements;
}

module.exports = function bytecodeObjectToAST (
  bytecode,
  imports = {},
  frontMatterNodes = [],
  backMatterNodes = [],
) {
  const oast = objectToOAST(bytecode);

  const ast = {
    type: 'File',
    comments: [],
    program: {
      type: 'Program',
      directives: [],
      sourceType: 'module',
      interpreter: null,
      body: buildRequireStatementsFromImports(imports)
        .concat(frontMatterNodes)
        .concat([
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'AssignmentExpression',
              operator: '=',
              left: {
                type: 'MemberExpression',
                object: {
                  type: 'Identifier',
                  name: 'module',
                },
                property: {
                  type: 'Identifier',
                  name: 'exports',
                },
              },
              right: oast,
            },
          },
        ])
        .concat(backMatterNodes),
    },
  };

  return ast;
};
