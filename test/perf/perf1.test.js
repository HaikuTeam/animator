var test = require('tape')
var TestHelpers = require('./../TestHelpers')
test('perf1', function (t) {
  t.plan(1)
  var bytecode = require('./../demo/chinese-food/code/main/code.js') // This demo has severely slow perf prior to optimizations
  TestHelpers.createComponent(bytecode, { autoplay: false, automount: false }, function (component, teardown, mount) {
    TestHelpers.timeBracket([
      function (done) {
        t.ok(true)
        done()
      }
    ], teardown)
  })
})
