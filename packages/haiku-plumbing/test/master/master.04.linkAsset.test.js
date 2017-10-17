var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var cp = require('child_process')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
var Master = require('./../../lib/Master').default
tape('master.04.linkAsset', (t) => {
  t.plan(5)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    var master = new Master(folder)
    async.series([
      function (cb) { return master.initializeFolder({ params: ['boobar', 'matthew+matthew@haiku.ai', 'supersecure', {}] }, cb) },
      function (cb) { return master.startProject({}, cb) },
      function (cb) {
        master.on('design-change', (relpath, assets) => {
          if (relpath === 'designs/beer.sketch.contents/pages/Page 1.svg') {
            t.equal(assets[0].pages.collection.length, 1, 'page is in assets collection')
          }
        })
        master.linkAsset({ params: [path.join(__dirname, '..', 'fixtures', 'files', 'sketch', 'beer', 'beer.sketch')] }, (err, assets) => {
          t.error(err, 'no err linking asset')
          t.ok(assets[0].type === 'sketch', 'asset is in list')
          t.ok(assets[0].fileName === 'beer.sketch', 'asset in list has filename')
          setTimeout(cb, 5000)
        })
      }
    ], (err) => {
      if (err) throw err
      t.ok(true)
      master.teardown(() => {
        teardown()  
      })
    })
  })
})
