const test = require('tape')
const path = require('path')
const TestHelpers = require('./../TestHelpers')

test('Timeline', function (t) {
  t.plan(1)
  TestHelpers.createApp(path.join(__dirname, '..', 'projects', 'complex'), (glass, window, teardown) => {
    TestHelpers.awaitElementById(window, 'timeline', (err, mount) => {
      t.ok(mount)
    })
  })
})
