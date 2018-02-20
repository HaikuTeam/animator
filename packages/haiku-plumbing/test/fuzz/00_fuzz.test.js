/**
 * Proves that a bunch of rapid async undo/redo actions don't cause a crash.
 */
const tape = require('tape')
const async = require('async')
const fse = require('haiku-fs-extra')
const path = require('path')
const TestHelpers = require('./../TestHelpers')
const MasterGitProject = require('./../../lib/MasterGitProject').default
tape('other.00', (t) => {
  t.plan(2)
  const changes = {}
  function change (relpath) {
    if (!changes[relpath]) changes[relpath] = 0
    changes[relpath] += 1
    return changes[relpath]
  }
  return TestHelpers.setup(function (folder, creator, glass, timeline, metadata, teardown, plumbing) {
    t.ok(true)
    const relpath = 'hello.txt'
    const abspath = path.join(folder, relpath)
    fse.outputFileSync(abspath, `${change(relpath)}`)
    const mgp = new MasterGitProject(folder)
    mgp.restart({ branchName: 'master' })
    return async.series([
      function (cb) { return plumbing.authenticateUser('matthew+matthew@haiku.ai', 'supersecure', cb) },
      function (cb) { return mgp.initializeProject({}, cb) },
      function (cb) { return mgp.commitProjectIfChanged('Initialized test folder', cb) },
      function (cb) { return mgp.setUndoBaselineIfHeadCommitExists(cb) },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },

      // TODO: Check the sha versions to ensure order is correct etc.
      function (cb) {
        mgp.undo({}, () => {})
        mgp.undo({}, () => {})
        mgp.undo({}, () => {})
        mgp.redo({}, () => {})
        mgp.redo({}, () => {})
        mgp.undo({}, () => {})
        mgp.redo({}, () => {})
        mgp.undo({}, () => {})
        mgp.redo({}, () => {})
        mgp.undo({}, () => {})
        mgp.undo({}, () => {})
        mgp.undo({}, () => {})
        mgp.redo({}, () => {})
        mgp.redo({}, () => {})
        mgp.undo({}, () => {})
        mgp.redo({}, () => {})
        mgp.undo({}, () => {})
        mgp.redo({}, () => {})
        setTimeout(cb, 1000)
      },

      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },

      function (cb) {
        mgp.undo({}, () => {})
        setTimeout(() => { mgp.undo({}, () => {}) }, 50)
        setTimeout(() => { mgp.redo({}, () => {}) }, 100)
        setTimeout(() => { mgp.undo({}, () => {}) }, 75)
        setTimeout(() => { mgp.redo({}, () => {}) }, 0)
        setTimeout(cb, 1000)
      },

      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },
      function (cb) {
        fse.outputFileSync(abspath, `${change(relpath)}`)
        return mgp.commitFileIfChanged(relpath, 'change', cb)
      },

      function (cb) {
        mgp.undo({}, () => {})
        setTimeout(() => { mgp.undo({}, () => {}) }, 50)
        setTimeout(() => { mgp.redo({}, () => {}) }, 100)
        setTimeout(() => { mgp.undo({}, () => {}) }, 75)
        setTimeout(() => { mgp.undo({}, () => {}) }, 75)
        setTimeout(() => { mgp.undo({}, () => {}) }, 75)
        setTimeout(() => { mgp.redo({}, () => {}) }, 0)
        setTimeout(cb, 1000)
      },

      function (cb) {
        mgp.undo({}, () => {})
        mgp.undo({}, () => {})
        mgp.redo({}, () => {})
        mgp.undo({}, () => {})
        mgp.redo({}, () => {})
        setTimeout(cb, 2000)
      },

      function (cb) {
        mgp.teardown(cb)
      }
    ], (err) => {
      t.error(err, 'finished without error')
      teardown()
    })
  })
})
