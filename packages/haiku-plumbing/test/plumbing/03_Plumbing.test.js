const tape = require('tape')
const async = require('async')
const fse = require('haiku-fs-extra')
const cp = require('child_process')
const path = require('path')
const lodash = require('lodash')
const TestHelpers = require('./../TestHelpers')
const BLUE_SVG_1 = path.join(__dirname, '..', 'fixtures', 'files', 'designs', 'bef', 'Blue.svg')
const DEF_SVG_1 = path.join(__dirname, '..', 'fixtures', 'files', 'designs', 'bef', 'Default.svg')
tape('Plumbing', (t) => {
  t.plan(34)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown, plumbing) {
    return async.series([
      (cb) => {
        return plumbing.authenticateUser('matthew+matthew@haiku.ai', 'supersecure', (err, resp) => {
          t.error(err, 'no auth err')
          t.ok(resp.username, 'username present')
          t.ok(resp.authToken, 'auth token present')
          t.ok(resp.organizationName, 'org name present')
          t.ok(plumbing.get('organizationName'), 'state org name present')
          t.ok(plumbing.get('username'), 'state username present')
          t.ok(plumbing.get('password'), 'state password present')
          t.ok(plumbing.get('inkstoneAuthToken'), 'state auth token present')
          return cb()
        })
      },
      (cb) => {
        // Mimicking what happens in Creator
        const projectOptions = {
          skipContentCreation: true,
          projectPath: folder,
        }
        return plumbing.initializeProject(null, projectOptions, 'matthew+matthew@haiku.ai', 'supersecure', (err, folder) => {
          t.error(err, 'no err initializing')
          t.ok(folder, 'folder created and path returned')
          t.equal(plumbing.masters.length, 1, 'only one master so far')
          t.equal(plumbing.masters[0].folder, folder, 'master has folder name')
          const gitloglines = cp.execSync('git log --pretty=oneline', { cwd: folder }).toString().split('\n')
          t.equal(gitloglines.length, 2, 'git log has two entries')
          return cb()
        })
      },
      (cb) => {
        return plumbing.startProject(null, folder, (err) => {
          t.error(err, 'no err starting')
          const gitloglines = cp.execSync('git log --pretty=oneline', { cwd: folder }).toString().split('\n')
          t.equal(gitloglines.length, 3, 'three git commits so far')
          return cb()
        })
      },
      (cb) => {
        return plumbing.awaitMasterAndCallMethod(folder, 'setCurrentActiveComponent', ['main', { from: 'test' }], (err) => {
          t.error(err, 'no error setting ac')
          return setTimeout(() => cb(), 1000)
        })
      },
      (cb) => {
        return plumbing.linkAsset(DEF_SVG_1, folder, (err, assets) => {
          t.error(err, 'no err linking asset')
          t.ok(assets, 'assets present')
          return cb()
        })
      },
    ], (err) => {
      // teardown()
    })
  })
})
