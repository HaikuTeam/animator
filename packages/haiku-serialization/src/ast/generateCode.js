var generate = require('@babel/generator').default

function generateCode (ast, options, code) {
  var output = generate(ast, options || {
    retainLines: true,
    comments: true
  }, code || '')

  return output.code
}

module.exports = generateCode
