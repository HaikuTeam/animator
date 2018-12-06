let _ = require('lodash');
let traverseAST = require('./traverseAST');
let matchesRequire = require('./matchesRequire');

/**
 * @function removeRequire
 * @description Given an AST, an identifier name, and a module path,
 * Remove any matching require statements (including their variable declarations)
 * from the AST. This should mutate the AST in place.
 */
module.exports = function removeRequire (ast, identifierName, modulePath) {
  // first traverse the AST to count the number of times the identifier is being used.
  // we assume there should be at least 1 usage (in the require stmt itself)
  let identCount = 0;
  traverseAST(ast, (node) => {
    if (node.type === 'Identifier' && node.name === identifierName) {
      identCount += 1;
    }
  });

  if (identCount > 1) {
    // we're being asked to remove an in-use require, should we do something?
    return;
  }

  // otherwise we just filter it out
  ast.program.body = _.filter(ast.program.body, (stmt) =>
      !matchesRequire(stmt, identifierName, modulePath));
};
