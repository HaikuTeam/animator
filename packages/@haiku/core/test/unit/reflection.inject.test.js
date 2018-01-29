var test = require('tape')

// Loading the one exposed from the root to ensure Haiku.inject ain't broken
var inject = require('./../../index').inject

test('reflection.inject', function (t) {
  t.plan(6)

  var f1 = inject(function (a,b,c) { return [a,b,c] })
  t.equal(JSON.stringify(f1.specification), '{"type":"FunctionExpression","name":null,"params":["a","b","c"],"body":"return [a,b,c]"}')
  t.equal(f1.injectee, true)

  // Make sure it's safe to double it up
  var f2 = inject(inject(function (a,b,c) { return [a,b,c] }))
  t.equal(JSON.stringify(f2.specification), '{"type":"FunctionExpression","name":null,"params":["a","b","c"],"body":"return [a,b,c]"}')
  t.equal(f2.injectee, true)

  // See what happens if only the flag is there
  var f3 = function(a,b,c) { return [a,b,c] }
  f3.injectee = true
  f3 = inject(f3, 'd','e','f') // ...And if we specify these
  t.equal(JSON.stringify(f3.specification), '{"type":"FunctionExpression","name":null,"params":["d","e","f"],"body":"return [a,b,c]","injectee":true}')
  t.equal(f3.injectee, true)
})
