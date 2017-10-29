var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
var Master = require('./../../lib/Master').default
tape('master.05.fetchAssets', (t) => {
  t.plan(1)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    fse.outputFileSync(path.join(folder, 'designs', 'Hello.svg'), '<svg><rect x="0" y="0" stroke="1" fill="black"></rect></svg>')
    var master = new Master(folder)
    async.series([
      function (cb) { return master.initializeFolder({ params: ['boobar', 'matthew+matthew@haiku.ai', 'supersecure', {}] }, cb) },
      function (cb) {
        master.fetchAssets({}, (err, assets) => {
          // assets[0] is the default sketch file
          t.ok(assets[1].fileName === 'Hello.svg', 'file name correct')
          return cb()
        })
      }
    ], (err) => {
      master.teardown(() => {
        teardown()  
      })
    })
  })
})
