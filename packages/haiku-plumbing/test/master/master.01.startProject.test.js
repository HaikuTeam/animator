var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
var Master = require('./../../lib/Master').default
tape('master.01.startProject', (t) => {
  t.plan(1)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    var master = new Master(folder)
    async.series([
      function (cb) {
        return master.initializeFolder({ params: ['boobar', 'matthew+matthew@haiku.ai', 'supersecure', {}] }, cb)
      },
      function (cb) {
        return master.startProject({}, cb)
      }
    ], (err) => {
      if (err) throw err
      t.ok(true)
      master.teardown()
      teardown()
    })
  })
})
