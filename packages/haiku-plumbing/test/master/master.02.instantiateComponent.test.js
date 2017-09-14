var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
var Master = require('./../../lib/Master').default
tape('master.02.instantiateComponent', (t) => {
  t.plan(1)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    var master = new Master(folder)
    async.series([
      function (cb) {
        return master.initializeFolder({ params: ['boobar', 'matthew+matthew@haiku.ai', 'supersecure', {}] }, cb)
      },
      function (cb) {
        return master.startProject({}, cb)
      },
      function (cb) {
        fse.writeFileSync(path.join(folder, 'Hello.svg'), '<svg><rect x="0" y="0" stroke="1" fill="black"></rect></svg>')
        return master.instantiateComponent({ params: ['Hello.svg', {}] }, cb)
      }
    ], (err) => {
      if (err) throw err
      t.ok(true)
      teardown()
    })
  })
})
