var test = require('tape')

// Loading the one exposed from the root to ensure Haiku.enhance ain't broken
var enhance = require('./../../index').enhance

test('reflection.enhance', function (t) {
  t.plan(1)

  var f1 = function(a,b,c) { return [a,b,c] }
  enhance(f1)
  t.equal(JSON.stringify(f1.specification), '{"type":"FunctionExpression","name":null,"params":["a","b","c"],"body":"return [a,b,c]"}')
})
