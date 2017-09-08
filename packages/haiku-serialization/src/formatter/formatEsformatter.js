var esformatter = require('esformatter')
// require('es-strip-semicolons')
// require('esformatter-jsx')

function formatEsformatter (code) {
  return esformatter.format(code, {
    extends: [],
    plugins: [
      'es-strip-semicolons',
      'esformatter-jsx'
    ],
    indent: {
      value: '  '
    },
    quotes: {
      type: 'single'
    },
    whiteSpace: {
      before: {
        FunctionName: 1,
        FunctionExpressionOpeningBrace: 1,
        FunctionExpressionClosingBrace: 1
      },
      after: {
        MethodDefinitionName: 1,
        FunctionReservedWord: 1,
        FunctionName: 1,
        FunctionExpressionOpeningBrace: 1,
        FunctionExpressionClosingBrace: 1
      }
    },
    lineBreak: {
      before: {
        ClassDeclaration: 2
      },
      after: {
        ImportDeclaration: 1,
        ObjectExpressionOpeningBrace: 1
      }
    }
  })
}

module.exports = formatEsformatter
