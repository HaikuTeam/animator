const tape = require('tape')
const async = require('async')
const fse = require('haiku-fs-extra')
const cp = require('child_process')
const path = require('path')
const lodash = require('lodash')
const TestHelpers = require('./../TestHelpers')
tape('Plumbing', (t) => {
  t.plan(22)
  TestHelpers.launch((plumbing, teardown) => {
    const projectName = 'TestProject' + Date.now()
    const getFolder = () => plumbing.masters[0].folder
    return async.series([
      (cb) => {
        return plumbing.authenticateUser('matthew+matthew@haiku.ai', 'supersecure', (err, resp) => {
          t.error(err, 'no auth err')
          return cb()
        })
      },
      (cb) => {
        return plumbing.listProjects((err, projectsList) => {
          t.error(err, 'no err listing initially')
          return cb()
        })
      },
      (cb) => {
        return plumbing.createProject(projectName, (err, projectObject) => {
          t.error(err, 'no err creating')
          if (!projectObject) {
            throw new Error('the test account has reached the max number projects')
          }
          t.ok(projectObject.projectName, 'proj obj has good format')
          return cb()
        })
      },
      (cb) => {
        return plumbing.listProjects((err, projectsList) => {
          t.error(err, 'no err listing after create')
          const foundProj = lodash.find(projectsList, { projectName })
          t.ok(foundProj, 'proj was listed after creation')
          return cb()
        })
      },
      (cb) => {
        // Mimicking what happens in Creator
        const projectOptions = { skipContentCreation: true, projectName }
        return plumbing.initializeProject(projectName, projectOptions, 'matthew+matthew@haiku.ai', 'supersecure', cb)
      },
      (cb) => {
        return plumbing.startProject(projectName, getFolder(), cb)
      },
      (cb) => {
        // First save should push it all
        const saveOptions = {} // ?
        return plumbing.saveProject(getFolder(), projectName, 'matthew+matthew@haiku.ai', 'supersecure', saveOptions, (err, shareInfo) => {
          t.error(err, 'no err saving')
          t.ok(shareInfo, 'share info present')
          const localsha = cp.execSync(`git rev-parse --verify HEAD`, { cwd: getFolder() }).toString().trim()
          t.equal(localsha, shareInfo && shareInfo.sha, 'local sha is share info sha')
          t.ok(shareInfo && shareInfo.shareLink, 'share link present')
          t.ok(shareInfo && shareInfo.projectUid, 'share project uid present')
          const pkg = fse.readJsonSync(path.join(getFolder(), 'package.json'))
          t.equal(pkg.version, '0.0.1', 'semver is 0.0.1')
          initialShareInfo = shareInfo
          return cb()
        })
      },
      (cb) => {
        // Second save should return right away with previous share link
        const saveOptions = {} // ?
        return plumbing.saveProject(getFolder(), projectName, 'matthew+matthew@haiku.ai', 'supersecure', saveOptions, (err, shareInfo) => {
          t.error(err, 'no err saving again')
          t.equal(initialShareInfo && initialShareInfo.sha, shareInfo && shareInfo.sha, 'new sha same as initial save because no change')
          return cb()
        })
      },
      (cb) => {
        // Third save, with a change, should push it all
        fse.outputFileSync(path.join(getFolder(), 'test.txt'), '123')
        return plumbing.saveProject(getFolder(), projectName, 'matthew+matthew@haiku.ai', 'supersecure', {}, (err, shareInfo) => {
          t.error(err, 'no err on save after file addition')
          t.ok(shareInfo, 'new share info present')
          t.ok(shareInfo && shareInfo.sha, 'share info sha present')
          const localsha = cp.execSync(`git rev-parse --verify HEAD`, { cwd: getFolder() }).toString().trim()
          t.equal(localsha, shareInfo && shareInfo.sha, 'local sha matches')
          const pkgjson = fse.readJsonSync(path.join(getFolder(), 'package.json'))
          t.equal(pkgjson.version, '0.0.2', 'version was bumped')
          return cb()
        })
      },
      (cb) => {
        // Clean up after ourselves
        return plumbing.deleteProject(projectName, cb)
      }
    ], (err) => {
      teardown()
    })
  })
})
