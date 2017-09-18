var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
var Master = require('./../../lib/Master').default
tape('git.statusForFile', (t) => {
  t.plan(4)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    var master = new Master(folder)
    master.initializeFolder({ params: ['boobar', 'matthew+matthew@haiku.ai', 'supersecure', {}] }, (err) => {
      t.error(err, 'no err initializing folder')
      fse.outputFileSync(path.join(folder, 'foobar'), 'blah')
      return master._git.statusForFile('foobar', (err, status) => {
        t.error(err, 'no err getting file status')
        t.ok(status, 'status is present for file')
        t.ok(status.isNew(), 'file is new')
        master.teardown()
        teardown()
      })
    })
  })
})
