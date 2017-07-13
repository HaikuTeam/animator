var test = require('tape')
var TestHelpers = require('./../TestHelpers')
test('perf1', function (t) {
  t.plan(3)
  var bytecode = require('./../demo/chinese-food/code/main/code.js') // This demo has severely slow perf prior to optimizations
  TestHelpers.createComponent(bytecode, {}, function (component, teardown, mount) {
    t.equal(mount.outerHTML.length, 48, 'html checksum ok')
    TestHelpers.timeBracket([
      function (done) {
        component._context.tick()
        return done(true)
      },
      function (done, delta) {
        console.log('[haiku player perf test] initial tick took ' + delta + ' vs baseline of 675')
        t.equal(mount.outerHTML.length, 158860, 'html checksum ok')
        return setTimeout(done, 100)
      },
      function (done) {
        component._context.tick()
        return done(true)
      },
      function (done, delta) {
        console.log('[haiku player perf test] patch took ' + delta + ' vs baseline of 30')
        t.equal(mount.outerHTML.length, 158860, 'html checksum ok')
        done()
      }
    ], teardown)
  })
})
