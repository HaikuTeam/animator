/**
 * @function matchesRequire
 * @description Checks if a given AST statment is in the format of a typical require
 * statement. i.e. `var ident = require(modulePath);`
 */
module.exports = function matchesRequire (stmt, identifierName, modulePath) {
  return (stmt.type === 'VariableDeclaration') &&
         (stmt.declarations.length === 1) &&
         (stmt.declarations[0].id.type === 'Identifier') &&
         (stmt.declarations[0].id.name === identifierName) &&
         (stmt.declarations[0].init.type === 'CallExpression') &&
         (stmt.declarations[0].init.callee.type === 'Identifier') &&
         (stmt.declarations[0].init.callee.name === 'require') &&
         (stmt.declarations[0].init.arguments.length === 1) &&
         (stmt.declarations[0].init.arguments[0].type === 'StringLiteral') &&
         (stmt.declarations[0].init.arguments[0].value === modulePath);
};
