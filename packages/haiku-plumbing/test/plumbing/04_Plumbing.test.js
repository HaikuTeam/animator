/* tslint:disable */
// const tape = require('tape')
// const async = require('async')
// const fse = require('haiku-fs-extra')
// const cp = require('child_process')
// const path = require('path')
// const lodash = require('lodash')
// const Project = require('haiku-serialization/src/bll/Project')
// const {randomString} = require('@haiku/core/lib/helpers/StringUtils')
// const TestHelpers = require('./../TestHelpers')
//
// let initialShareInfo
//
// tape('Plumbing', (t) => {
//   TestHelpers.launch((plumbing, _, teardown) => {
//     const projectName = 'TestProject' + randomString(20)
//     const duplicateProjectName = 'TestProject' + randomString(20)
//     const isPublic = false
//     return async.waterfall([
//       (cb) => {
//         return plumbing.authenticateUser('jenkins@haiku.ai', 'supersecure', (err, resp) => {
//           t.error(err, 'no auth err')
//           return cb()
//         })
//       },
//       (cb) => {
//         return plumbing.listProjects((err) => {
//           t.error(err, 'no err listing initially')
//           return cb()
//         })
//       },
//       (cb) => {
//         return plumbing.createProject(projectName, isPublic, (err, projectObject) => {
//           t.error(err, 'no err creating')
//           if (!projectObject) {
//             throw new Error('the test account has reached the max number projects')
//           }
//           t.ok(projectObject.projectName, 'proj obj has good format')
//           return cb()
//         })
//       },
//       (cb) => {
//         return plumbing.listProjects((err, projectsList) => {
//           t.error(err, 'no err listing after create')
//           const foundProj = lodash.find(projectsList, { projectName })
//           t.ok(foundProj, 'proj was listed after creation')
//           return cb(null, foundProj)
//         })
//       },
//       (project, cb) => {
//         // Mimicking what happens in Creator
//         const projectOptions = Object.assign(
//           {
//             skipContentCreation: true
//           },
//           project
//         )
//         return plumbing.bootstrapProject(
//           projectName,
//           projectOptions,
//           'jenkins@haiku.ai',
//           'supersecure',
//           () => cb(null, project)
//         )
//       },
//       (project, cb) => {
//         return plumbing.startProject(projectName, project.projectPath, () => cb(null, project))
//       },
//       (project, cb) => {
//         // First save should push it all
//         const saveOptions = {} // ?
//         return plumbing.saveProject(project.projectPath, projectName, 'jenkins@haiku.ai', 'supersecure', saveOptions, (err, shareInfo) => {
//           t.error(err, 'no err saving')
//           t.ok(shareInfo, 'share info present')
//           const localsha = cp.execSync(`git rev-parse --verify HEAD`, { cwd: project.projectPath }).toString().trim()
//           t.equal(localsha, shareInfo && shareInfo.sha, 'local sha is share info sha')
//           t.ok(shareInfo && shareInfo.shareLink, 'share link present')
//           t.ok(shareInfo && shareInfo.projectUid, 'share project uid present')
//           const pkg = fse.readJsonSync(path.join(project.projectPath, 'package.json'))
//           t.equal(pkg.version, '0.0.1', 'semver is 0.0.1')
//           initialShareInfo = shareInfo
//           return cb(null, project)
//         })
//       },
//       (project, cb) => {
//         // Second save should return right away with previous share link
//         const saveOptions = {} // ?
//         return plumbing.saveProject(project.projectPath, projectName, 'jenkins@haiku.ai', 'supersecure', saveOptions, (err, shareInfo) => {
//           t.error(err, 'no err saving again')
//           t.equal(initialShareInfo && initialShareInfo.sha, shareInfo && shareInfo.sha, 'new sha same as initial save because no change')
//           return cb(null, project)
//         })
//       },
//       (project, cb) => {
//         // Third save, with a change, should push it all
//         fse.outputFileSync(path.join(project.projectPath, 'test.txt'), '123')
//         return plumbing.saveProject(project.projectPath, projectName, 'jenkins@haiku.ai', 'supersecure', {}, (err, shareInfo) => {
//           t.error(err, 'no err on save after file addition')
//           t.ok(shareInfo, 'new share info present')
//           t.ok(shareInfo && shareInfo.sha, 'share info sha present')
//           const localsha = cp.execSync(`git rev-parse --verify HEAD`, { cwd: project.projectPath }).toString().trim()
//           t.equal(localsha, shareInfo && shareInfo.sha, 'local sha matches')
//           const pkgjson = fse.readJsonSync(path.join(project.projectPath, 'package.json'))
//           t.equal(pkgjson.version, '0.0.2', 'version was bumped')
//           return cb(null, project)
//         })
//       },
//       (project, cb) => {
//         // Write out multiple dummy references to the primary asset path of the Sketch asset to verify all are changed.
//         const sourceBytecodePath = path.join(project.projectPath, 'code', 'main', 'code.js')
//         const sourceBytecode = fse.readFileSync(sourceBytecodePath)
//         const {primaryAssetPath} = Project.getProjectNameVariations(project.projectPath)
//         fse.writeFileSync(sourceBytecodePath, `${sourceBytecode}
// var primaryAssetPath =     '${primaryAssetPath}'
// var alsoPrimaryAssetPath = '${primaryAssetPath}'
// `)
//         // Make a duplicate and verify it has the expected contents.
//         return plumbing.createProject(duplicateProjectName, isPublic, (err, duplicateProject) => {
//           t.error(err, 'no err creating')
//           if (!duplicateProject) {
//             throw new Error('the test account has reached the max number projects')
//           }
//           t.equal(duplicateProject.projectName, duplicateProjectName, 'proj obj has good format')
//           project.projectExistsLocally = true
//           plumbing.duplicateProject(duplicateProject, project, () => {
//             const sourceBytecode = fse.readFileSync(sourceBytecodePath).toString()
//             const destinationBytecode = fse.readFileSync(
//               path.join(duplicateProject.projectPath, 'code', 'main', 'code.js')
//             ).toString()
//             const newPrimaryAssetPath = primaryAssetPath.replace(
//               project.projectName.slice(0, 20),
//               duplicateProject.projectName.slice(0, 20)
//             )
//             t.notEqual(primaryAssetPath, newPrimaryAssetPath, 'renamed sketched file has different name')
//             t.true(sourceBytecode.includes(primaryAssetPath), 'source bytecode includes stubbed in primary asset path')
//             t.true(
//               destinationBytecode.includes(newPrimaryAssetPath),
//               'destination bytecode includes renamed primary asset'
//             )
//             t.equal(
//               sourceBytecode.split(primaryAssetPath).join(newPrimaryAssetPath),
//               destinationBytecode,
//               'bytecode is identical except for renamed primary asset'
//             )
//             t.ok(
//               fse.existsSync(
//                 path.join(duplicateProject.projectPath, newPrimaryAssetPath)
//               ),
//               'duplicated project has renamed default Sketch file'
//             )
//             return cb(null, project, duplicateProject)
//           })
//         })
//       },
//       (project, duplicateProject, cb) => {
//         // Clean up after ourselves
//         return plumbing.deleteProject(
//           projectName,
//           project.projectPath,
//           () => plumbing.deleteProject(
//             // Clean up our duplicate too!
//             duplicateProjectName,
//             duplicateProject.projectPath,
//             () => cb(null, project)
//           )
//         )
//       },
//       (project, cb) => {
//         // We should have backed up the project contents when we deleted them locally.
//         t.ok(fse.existsSync(`${project.projectPath}.bak`), 'a .bak-suffixed backup copy was made')
//         return cb(null, project)
//       },
//       (project, cb) => {
//         // We should have backed up the project contents when we deleted them locally.
//         plumbing.teardownMaster(project.projectPath, () => cb(null, project))
//       },
//       (project, cb) => {
//         teardown(() => {
//           cb(null, project)
//         })
//       }
//     ], () => {
//       t.end()
//     })
//   })
// })
