var tape = require('tape')
var async = require('async')
var lodash = require('lodash')
var fse = require('haiku-fs-extra')
var cp = require('child_process')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
tape('plumbing.05.saveProject', (t) => {
  t.plan(6)
  var projectName = 'UnitTestProj' + Date.now()
  TestHelpers.launch((plumbing, teardown) => {
    var folder = () => { return plumbing.subprocs[0]._attributes.folder }
    return async.series([
      function (cb) { return plumbing.authenticateUser('matthew+matthew@haiku.ai', 'supersecure', cb) },
      function (cb) { return plumbing.listProjects(cb) },
      function (cb) { return plumbing.createProject(projectName, cb) },
      function (cb) { return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', cb) },
      function (cb) { return plumbing.startProject(projectName, folder(), cb) },
      function (cb) { return plumbing.saveProject(folder(), projectName, 'matthew+matthew@haiku.ai', 'supersecure', {}, cb) },
      function (cb) { return plumbing.saveProject(folder(), projectName, 'matthew+matthew@haiku.ai', 'supersecure', {}, cb) },
      function (cb) {
        fse.outputFileSync(path.join(folder(), 'test.txt'), '123')
        return plumbing.saveProject(folder(), projectName, 'matthew+matthew@haiku.ai', 'supersecure', {}, (err, shareInfo) => {
          t.error(err, 'no err on save after file addition')
          t.ok(shareInfo, 'new share info present')
          t.ok(shareInfo && shareInfo.sha, 'share info sha present')
          var localsha = cp.execSync(`git rev-parse --verify HEAD`, { cwd: folder() }).toString().trim()
          t.equal(localsha, shareInfo && shareInfo.sha, 'local sha matches')
          var pkgjson = fse.readJsonSync(path.join(folder(), 'package.json'))
          t.equal(pkgjson.version, '0.0.2', 'version was bumped')
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
