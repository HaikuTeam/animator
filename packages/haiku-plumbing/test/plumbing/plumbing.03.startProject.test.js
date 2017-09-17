var tape = require('tape')
var async = require('async')
var lodash = require('lodash')
var fse = require('haiku-fs-extra')
var cp = require('child_process')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
tape('plumbing.03.startProject', (t) => {
  t.plan(3)
  var projectName = 'UnitTestProj' + Date.now()
  TestHelpers.launch((plumbing, teardown) => {
    var folder = () => { return plumbing.subprocs[0]._attributes.folder }
    return async.series([
      function (cb) { return plumbing.authenticateUser('matthew+matthew@haiku.ai', 'supersecure', cb) },
      function (cb) { return plumbing.createProject(projectName, cb) },
      function (cb) { return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', cb) },
      function (cb) {
        return plumbing.startProject(projectName, folder(), (err) => {
          t.error(err, 'no err starting')
          var gitloglines = cp.execSync('git log --pretty=oneline', { cwd: folder() }).toString().split('\n')
          t.equal(gitloglines.length, 4, 'three git commits so far')
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
