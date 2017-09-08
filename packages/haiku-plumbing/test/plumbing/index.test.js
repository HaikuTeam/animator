var tape = require('tape')
var TestHelpers = require('./../TestHelpers')
tape('plumbing:index', (t) => {
  t.plan(1)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    teardown()
    t.ok(true)  
  })
})
