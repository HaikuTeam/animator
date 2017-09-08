var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var cp = require('child_process')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
var ProjectFolder = require('./../../lib/ProjectFolder')
var FIXTURE_BASE = path.join(__dirname, '..', 'fixtures', 'projects', 'Hearts1')
var FIXTURE_DEST = path.join(__dirname, '..', 'fixtures', 'projects', 'Hearts1InProgress')
process.env.HAIKU_SKIP_NPM_INSTALL = '1'
tape('ProjectFolder.buildProjectContent', (t) => {
  t.plan(2)

  // setup
  cp.execSync(`cp -r ${JSON.stringify(FIXTURE_BASE + '/')}/ ${JSON.stringify(FIXTURE_DEST)}`, { stdio: 'inherit' })

  ProjectFolder.buildProjectContent(null, FIXTURE_DEST, 'Hearts1InProgress', 'haiku', {}, (err) => {
    t.error(err, 'no err')
  
    // teardown
    cp.execSync(`rm -rf ${JSON.stringify(FIXTURE_DEST)}`, { stdio: 'inherit' })

    t.ok(true)
  })
})
