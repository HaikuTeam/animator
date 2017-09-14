var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
var Master = require('./../../lib/Master').default
tape('master.fetchAssets', (t) => {
  t.plan(1)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    fse.outputFileSync(path.join(folder, 'designs', 'Hello.svg'), '<svg><rect x="0" y="0" stroke="1" fill="black"></rect></svg>')
    var master = new Master(folder)
    master.fetchAssets({}, (err, assets) => {
      t.ok(assets[0].fileName === 'Hello.svg', 'file name correct')
      teardown()
    })
  })
})
