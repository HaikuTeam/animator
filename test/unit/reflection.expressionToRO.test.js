var test = require('tape')
var expressionToRO = require('./../../src/reflection/expressionToRO')

test('reflection.expressionToRO', function (t) {
  t.plan(2)

  var exp1 = {
    func: function(a,b,c) {
      return 123
    }
  }
  var ro1 = expressionToRO(exp1)
  t.equal(JSON.stringify(ro1), '{"func":{"__function":{"type":"FunctionExpression","name":null,"params":["a","b","c"],"body":"return 123"}}}')

  // It should leave this thing as-is since it's already serialized
  var exp2 = {
    func: {
      __function: {
        params: ['a','b','c'],
        body: 'return 123'
      }
    }
  }
  var ro2 = expressionToRO(exp2)
  t.equal(JSON.stringify(ro2), '{"func":{"__function":{"params":["a","b","c"],"body":"return 123"}}}')
})
