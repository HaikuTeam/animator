let parseCode = require('./parseCode');
let traverseAST = require('./traverseAST');
let generateCode = require('./generateCode');

function remapSource (source, remapper) {
  if (!remapper) {
    return source;
  }

  // Otherwise, scan for imports and replace them with the local to that lib
  const ast = parseCode(source);
  traverseAST(ast, (node) => {
    if (node.type === 'ImportDeclaration') {
      if (node.source && node.source.type === 'StringLiteral') {
        node.source.value = remapper(node.source.value);
      }
    } else if (node.type === 'CallExpression') {
      if (node.callee && node.callee.type === 'Identifier' && node.callee.name === 'require') {
        const dep = node.arguments[0];
        if (dep && dep.type === 'StringLiteral') {
          dep.value = remapper(dep.value);
        } else if (dep.type === 'TemplateLiteral') {
          const part = dep.quasis[0];
          if (part && part.value) {
            part.value.raw = remapper(part.value.raw);
          }
        }
      }
    }
  });

  const transformed = generateCode(ast);
  return transformed;
}

module.exports = remapSource;
