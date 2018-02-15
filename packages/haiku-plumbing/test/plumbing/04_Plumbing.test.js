const tape = require('tape')
const async = require('async')
const fse = require('haiku-fs-extra')
const cp = require('child_process')
const path = require('path')
const lodash = require('lodash')
const {randomString} = require('@haiku/core/lib/helpers/StringUtils')
const TestHelpers = require('./../TestHelpers')

tape('Plumbing', (t) => {
  TestHelpers.launch((plumbing, teardown) => {
    const projectName = 'TestProject' + randomString(9)
    const duplicateProjectName = `${projectName}Copy`
    return async.waterfall([
      (cb) => {
        return plumbing.authenticateUser('matthew+matthew@haiku.ai', 'supersecure', (err, resp) => {
          t.error(err, 'no auth err')
          return cb()
        })
      },
      (cb) => {
        return plumbing.listProjects((err) => {
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
          return cb(null, foundProj)
        })
      },
      (project, cb) => {
        // Mimicking what happens in Creator
        const projectOptions = Object.assign(
          {
            skipContentCreation: true
          },
          project
        )
        return plumbing.initializeProject(
          projectName,
          projectOptions,
          'matthew+matthew@haiku.ai',
          'supersecure',
          () => cb(null, project)
        )
      },
      (project, cb) => {
        return plumbing.startProject(projectName, project.projectPath, () => cb(null, project))
      },
      (project, cb) => {
        // First save should push it all
        const saveOptions = {} // ?
        return plumbing.saveProject(project.projectPath, projectName, 'matthew+matthew@haiku.ai', 'supersecure', saveOptions, (err, shareInfo) => {
          t.error(err, 'no err saving')
          t.ok(shareInfo, 'share info present')
          const localsha = cp.execSync(`git rev-parse --verify HEAD`, { cwd: project.projectPath }).toString().trim()
          t.equal(localsha, shareInfo && shareInfo.sha, 'local sha is share info sha')
          t.ok(shareInfo && shareInfo.shareLink, 'share link present')
          t.ok(shareInfo && shareInfo.projectUid, 'share project uid present')
          const pkg = fse.readJsonSync(path.join(project.projectPath, 'package.json'))
          t.equal(pkg.version, '0.0.1', 'semver is 0.0.1')
          initialShareInfo = shareInfo
          return cb(null, project)
        })
      },
      (project, cb) => {
        // Second save should return right away with previous share link
        const saveOptions = {} // ?
        return plumbing.saveProject(project.projectPath, projectName, 'matthew+matthew@haiku.ai', 'supersecure', saveOptions, (err, shareInfo) => {
          t.error(err, 'no err saving again')
          t.equal(initialShareInfo && initialShareInfo.sha, shareInfo && shareInfo.sha, 'new sha same as initial save because no change')
          return cb(null, project)
        })
      },
      (project, cb) => {
        // Third save, with a change, should push it all
        fse.outputFileSync(path.join(project.projectPath, 'test.txt'), '123')
        return plumbing.saveProject(project.projectPath, projectName, 'matthew+matthew@haiku.ai', 'supersecure', {}, (err, shareInfo) => {
          t.error(err, 'no err on save after file addition')
          t.ok(shareInfo, 'new share info present')
          t.ok(shareInfo && shareInfo.sha, 'share info sha present')
          const localsha = cp.execSync(`git rev-parse --verify HEAD`, { cwd: project.projectPath }).toString().trim()
          t.equal(localsha, shareInfo && shareInfo.sha, 'local sha matches')
          const pkgjson = fse.readJsonSync(path.join(project.projectPath, 'package.json'))
          t.equal(pkgjson.version, '0.0.2', 'version was bumped')
          return cb(null, project)
        })
      },
      (project, cb) => {
        // Make a duplicate and verify it has the expected contents.
        return plumbing.createProject(duplicateProjectName, (err, duplicateProject) => {
          t.error(err, 'no err creating')
          if (!duplicateProject) {
            throw new Error('the test account has reached the max number projects')
          }
          t.equal(duplicateProject.projectName, duplicateProjectName, 'proj obj has good format')
          project.projectExistsLocally = true
          plumbing.duplicateProject(duplicateProject, project, () => {
            t.equal(
              fse.readFileSync(path.join(project.projectPath, 'code', 'main', 'code.js')).toString(),
              fse.readFileSync(path.join(duplicateProject.projectPath, 'code', 'main', 'code.js')).toString(),
              'duplicated project has the same bytecode'
            )
            t.ok(
              fse.existsSync(path.join(duplicateProject.projectPath, 'designs', `${duplicateProjectName}.sketch`)),
              'duplicated project has renamed default Sketch file'
            )
            return cb(null, project, duplicateProject)
          })
        })
      },
      (project, duplicateProject, cb) => {
        // Clean up after ourselves
        return plumbing.deleteProject(
          projectName,
          project.projectPath,
          () => plumbing.deleteProject(
            // Clean up our duplicate too!
            duplicateProjectName,
            duplicateProject.projectPath,
            () => cb(null, project)
          )
        )
      },
      (project, cb) => {
        // We should have backed up the project contents when we deleted them locally.
        t.ok(fse.existsSync(`${project.projectPath}.bak`), 'a .bak-suffixed backup copy was made')
        return cb(null, project)
      },
      (project, cb) => {
        // We should have backed up the project contents when we deleted them locally.
        plumbing.teardownMaster(project.projectPath, () => cb(null, project))
      }
    ], (err) => {
      teardown()
      t.end()
    })
  })
})
