const test = require('tape')
const path = require('path')
const TestHelpers = require('./../TestHelpers')

test('Glass', function (t) {
  t.plan(1)
  TestHelpers.createApp(path.join(__dirname, '..', 'projects', 'simple'), (glass, window, teardown) => {
    TestHelpers.awaitElementById(window, 'haiku-mount-container', (err, mount) => {
      t.ok(mount)
    })
  })
})
