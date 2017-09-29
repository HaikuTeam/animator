// var tape = require('tape')
// var async = require('async')
// var fse = require('haiku-fs-extra')
// var cp = require('child_process')
// var path = require('path')
// var TestHelpers = require('./../TestHelpers')
// var Master = require('./../../lib/Master').default
// var MasterGitProject = require('./../../lib/MasterGitProject').default
// var Git = require('./../../lib/Git')
// tape('other.00', (t) => {
//   t.plan(2)
//   var changes = {}
//   function change (relpath) {
//     if (!changes[relpath]) changes[relpath] = 0
//     changes[relpath] += 1
//     return changes[relpath]
//   }
//   return TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
//     t.ok(true)
//     fse.outputFileSync(path.join(folder, 'hello.txt'), `${change('hello.txt')}`)
//     fse.outputFileSync(path.join(folder, 'goodbye.txt'), `${change('goodbye.txt')}`)
//     fse.outputFileSync(path.join(folder, 'aloha.txt'), `${change('aloha.txt')}`)
//     var mgp = new MasterGitProject(folder)
//     mgp.restart({ branchName: 'master' })
//     return async.series([
//       function (cb) { return mgp.initializeProject({}, cb)  },
//       function (cb) { return mgp.snapshotCommitProject('Initialized test folder', cb) },
//       function (cb) { return mgp.setUndoBaselineIfHeadCommitExists(cb) },
//       function (cb) {
//         fse.outputFileSync(path.join(folder, 'hello.txt'), `${change('hello.txt')}`)
//         fse.removeSync(path.join(folder, 'goodbye.txt'))
//         fse.outputFileSync(path.join(folder, 'meow.txt'), `${change('meow.txt')}`)
//         mgp.snapshotCommitProject('check #1', () => {})
//         mgp.snapshotCommitProject('check #2', () => {})
//         mgp.snapshotCommitProject('check #3', () => {})
//         mgp.snapshotCommitProject('check #4', () => {})
//         mgp.snapshotCommitProject('check #5', () => {})
//         setTimeout(cb, 10000)
//       },

//     ], (err) => {
//       t.error(err, 'finished without error')
//       mgp.teardown()
//       teardown()
//     })
//   })
// })
