var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
var Master = require('./../../lib/Master').default
tape('master.00.initializeFolder', (t) => {
  t.plan(1)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    var master = new Master(folder)
    master.initializeFolder({ params: ['boobar', 'matthew+matthew@haiku.ai', 'supersecure', {}] }, (err) => {
      t.ok(true)
      master.teardown()
      teardown()
    })
  })
})
