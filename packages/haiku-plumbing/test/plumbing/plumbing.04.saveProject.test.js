var tape = require('tape')
var async = require('async')
var lodash = require('lodash')
var fse = require('haiku-fs-extra')
var cp = require('child_process')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
tape('plumbing.04.saveProject', (t) => {
  t.plan(9)
  var projectName = 'UnitTestProj' + Date.now()
  var initialShareInfo = null
  TestHelpers.launch((plumbing, teardown) => {
    var folder = () => { return plumbing.subprocs[0]._attributes.folder }
    return async.series([
      function (cb) { return plumbing.authenticateUser('matthew+matthew@haiku.ai', 'supersecure', cb) },
      function (cb) { return plumbing.listProjects(cb) },
      function (cb) { return plumbing.createProject(projectName, cb) },
      function (cb) { return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', cb) },
      function (cb) { return plumbing.startProject(projectName, folder(), cb) },
      function (cb) {
        // First save should push it all
        var saveOptions = {} // ?
        return plumbing.saveProject(folder(), projectName, 'matthew+matthew@haiku.ai', 'supersecure', saveOptions, (err, shareInfo) => {
          t.error(err, 'no err saving')
          t.ok(shareInfo, 'share info present')
          var localsha = cp.execSync(`git rev-parse --verify HEAD`, { cwd: folder() }).toString().trim()
          t.equal(localsha, shareInfo.sha, 'local sha is share info sha')
          t.ok(shareInfo.shareLink, 'share link present')
          t.ok(shareInfo.projectUid, 'share project uid present')
          var pkg = fse.readJsonSync(path.join(folder(), 'package.json'))
          t.equal(pkg.version, '0.0.1', 'semver is 0.0.1')
          initialShareInfo = shareInfo
          return cb()
        })
      },
      function (cb) {
        // Second save should return right away with previous share link
        var saveOptions = {} // ?
        return plumbing.saveProject(folder(), projectName, 'matthew+matthew@haiku.ai', 'supersecure', saveOptions, (err, shareInfo) => {
          t.error(err, 'no err saving again')
          t.equal(initialShareInfo && initialShareInfo.sha, shareInfo.sha, 'new sha same as initial save because no change')
          return cb()
        })
      },
      function (cb) { return plumbing.deleteProject(projectName, cb) }
    ], (err) => {
      if (err) throw err
      t.ok(true)
      teardown()
    })
  })
})
