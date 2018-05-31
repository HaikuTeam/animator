const tape = require('tape');
const async = require('async');
const IntegrationTest = require('haiku-testing/lib/IntegrationTest').default;

tape('default', (t) => {
  const it = new IntegrationTest()

  async.series([
    (cb) => {
      it.setup(cb)
    },
    (cb) => {
      it.initializeDefaultProjectWithDefaultAccount(cb)
    },
    (cb) => {
      it.teardownDefaultProjectWithDefaultAccount(cb)
    },
    (cb) => {
      it.teardown(cb)
    },
  ], () => {
    t.end();
  })
});
