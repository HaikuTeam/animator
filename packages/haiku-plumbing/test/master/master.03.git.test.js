var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var cp = require('child_process')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
var Master = require('./../../lib/Master').default
tape('master.03.git', (t) => {
  t.plan(4)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    var master = new Master(folder)
    async.series([
      function (cb) { return master.initializeFolder({ params: ['boobar', 'matthew+matthew@haiku.ai', 'supersecure', {}] }, cb) },
      function (cb) { return master.startProject({}, cb) },
      function (cb) {
        t.equal(master._git._gitUndoables.length, 1, '1 git undoable')
        return cb()
      },
      function (cb) {
        fse.writeFileSync(path.join(folder, 'Hello.svg'), '<svg><rect x="0" y="0" stroke="1" fill="black"></rect></svg>')
        setTimeout(() => {
          t.equal(master._git._gitUndoables.length, 2, '2 git undoables')
          return master.instantiateComponent({ params: ['Hello.svg', {}] }, cb)
        }, 2000)
      },
      function (cb) {
        setTimeout(() => {
          t.equal(master._git._gitUndoables.length, 3, '3 git undoables')
          return cb()
        }, 2000)
      }
    ], (err) => {
      if (err) throw err
      t.ok(true)
      master.teardown()
      teardown()
    })
  })
})
