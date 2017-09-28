var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var cp = require('child_process')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
var Master = require('./../../lib/Master').default
var MasterGitProject = require('./../../lib/MasterGitProject').default
var Git = require('./../../lib/Git')
tape('other.00', (t) => {
  t.plan(2)
  var changes = {}
  function change (relpath) {
    if (!changes[relpath]) changes[relpath] = 0
    changes[relpath] += 1
    return changes[relpath]
  }
  return TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    t.ok(true)
    var relpath = 'hello.txt'
    var abspath = path.join(folder, relpath)
    fse.outputFileSync(abspath, `${change(relpath)}`)
    var mgp = new MasterGitProject(folder)
    mgp.restart({ branchName: 'master' })
    return async.series([
      function (cb) { return mgp.initializeProject({}, cb)  },
      function (cb) { return mgp.snapshotCommitProject('Initialized test folder', cb) },
      function (cb) { return mgp.setUndoBaselineIfHeadCommitExists(cb) },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', (err, out) => {
          console.log('commit out:', err, out)
          return cb()
        })
      }
    ], (err) => {
      t.error(err, 'finished without error')
      teardown()
    })
  })
})
