let parseCode = require('./parseCode');
let wrapInHaikuInject = require('./wrapInHaikuInject');

function functionToASTExpression (fn) {
  const str = fn.toString().trim();
  const wrapped = '(\n' + str + '\n)';
  const ast = parseCode(wrapped);
  const expr = ast.program.body[0].expression;

  // TODO: I'm not sure where this should really belong, but this seems ok for now?
  // If we have a function that has been flagged an 'injectee' we need to wrap it in
  // a Haiku.inject expression before it is written to the final file
  if (fn.injectee) {
    // Note that this assumes the function arguments are *Identifiers*, not ObjectPatterns
    return wrapInHaikuInject(expr);
  }

  return expr;
}

module.exports = functionToASTExpression;
