var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
var Master = require('./../../lib/Master').default
var Git = require('./../../lib/Git')
tape('git.statusForFile.many', (t) => {
  t.plan(8)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    var master = new Master(folder)
    return master.initializeFolder({ params: ['boobar', 'matthew+matthew@haiku.ai', 'supersecure', {}] }, (err) => {
      t.error(err, 'no err initializing folder')
      return async.series([
        function (cb) {
          return Git.status(folder, {}, (err, statuses) => {
            t.error(err, 'no statuses err')
            t.equal(Object.keys(statuses).length, 0, 'no statuses')
            return cb()
          })
        },
        function (cb) {
          fse.outputFileSync(path.join(folder, 'foo.txt'), `hello`)
          return Git.status(folder, {}, (err, statuses) => {
            t.error(err, 'no statuses err')
            t.equal(statuses['foo.txt'].num, 7, 'file is untracked')
            return cb()
          })
        },
        function (cb) {
          fse.outputFileSync(path.join(folder, 'README.md'), `NEW README YAY`)
          return Git.status(folder, {}, (err, statuses) => {
            t.error(err, 'no statuses err')
            t.equal(statuses['README.md'].num, 3, 'file is modified')
            return cb()
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
})
