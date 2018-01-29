var test = require('tape')
var PRNG = require('./../../lib/helpers/PRNG').default

test('PRNG', function (t) {
  t.plan(3)

  var prng = new PRNG('abcde')
  t.ok(prng)
  t.equal(prng.random(), 0.23144008215179881)
  t.equal(prng.random(), 0.27404636548159655)
})
