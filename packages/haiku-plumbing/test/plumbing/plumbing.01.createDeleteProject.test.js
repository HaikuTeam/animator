var tape = require('tape')
var async = require('async')
var lodash = require('lodash')
var fse = require('haiku-fs-extra')
var cp = require('child_process')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
tape('plumbing.01.createDeleteProject', (t) => {
  t.plan(7)
  var projectName = 'UnitTestProj' + Date.now()
  TestHelpers.launch((plumbing, teardown) => {
    return async.series([
      function (cb) { return plumbing.authenticateUser('matthew+matthew@haiku.ai', 'supersecure', cb) },
      function (cb) {
        return plumbing.createProject(projectName, (err, projectObject) => {
          t.error(err, 'no err creating')
          t.ok(projectObject.projectName, 'proj obj has good format')
          return cb()
        })
      },
      function (cb) {
        return plumbing.listProjects((err, projectsList) => {
          t.error(err, 'no err listing')
          var foundProj = lodash.find(projectsList, { projectName })
          t.ok(foundProj, 'proj was listed after creation')
          return cb()
        })
      },
      function (cb) {
        return plumbing.deleteProject(projectName, cb)
      },
      function (cb) {
        return plumbing.listProjects((err, projectsList) => {
          t.error(err, 'no err listing')
          var foundProj = lodash.find(projectsList, { projectName })
          t.ok(!foundProj, 'proj was delisted after creation')
          return cb()
        })
      },
    ], (err) => {
      if (err) throw err
      t.ok(true)
      teardown()
    })
  })
})
