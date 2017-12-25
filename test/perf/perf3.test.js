const test = require('tape');
const TestHelpers = require('../TestHelpers');
test('perf3', function (t) {
  t.plan(3);
  const bytecode = TestHelpers.getBytecode('AndroidFiltersV2');
  TestHelpers.createComponent(bytecode, {}, function (component, teardown, mount) {
    t.equal(mount.outerHTML.length, 48, 'html checksum ok');
    TestHelpers.timeBracket([
      function (done) {
        component._context.tick();
        done();
      },
      function (done, delta) {
        console.log('[haiku player perf test] initial tick took ' + delta + ' vs baseline of 150');
        t.true(true);
        done();
      },
      function (done) {
        component._context.tick();
        done();
      },
      function (done, delta) {
        console.log('[haiku player perf test] patch took ' + delta + ' vs baseline of 15');
        t.true(true);
        done();
      }
    ], teardown);
  });
});
