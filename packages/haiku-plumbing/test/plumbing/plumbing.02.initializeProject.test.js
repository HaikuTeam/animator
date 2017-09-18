var tape = require('tape')
var async = require('async')
var lodash = require('lodash')
var fse = require('haiku-fs-extra')
var cp = require('child_process')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
tape('plumbing.02.initializeProject', (t) => {
  t.plan(7)
  var projectName = 'UnitTestProj' + Date.now()
  TestHelpers.launch((plumbing, teardown) => {
    return async.series([
      function (cb) { return plumbing.authenticateUser('matthew+matthew@haiku.ai', 'supersecure', cb) },
      function (cb) { return plumbing.createProject(projectName, cb) },
      function (cb) {
        // Mimick ing what happens in Creator
        var projectOptions = {
          skipContentCreation: true,
          projectName
        }
        return plumbing.initializeProject(projectName, projectOptions, 'matthew+matthew@haiku.ai', 'supersecure', (err, folder) => {
          t.error(err, 'no err initializing')
          t.ok(folder, 'folder created and path returned')
          t.equal(plumbing.subprocs.length, 1, 'only one subproc so far')
          t.equal(plumbing.subprocs[0]._attributes.name, 'master', 'first subproc is master')
          t.equal(plumbing.subprocs[0]._attributes.folder, folder, 'master subproc has folder name')
          var gitloglines = cp.execSync('git log --pretty=oneline', { cwd: folder }).toString().split('\n')
          t.equal(gitloglines.length, 3, 'git log has two entries')
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
