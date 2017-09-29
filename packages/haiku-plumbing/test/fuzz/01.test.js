// /**
//  * Proves that a bunch of rapid project initializations don't cause a crash
//  */
// var tape = require('tape')
// var async = require('async')
// var lodash = require('lodash')
// var fse = require('haiku-fs-extra')
// var cp = require('child_process')
// var path = require('path')
// var TestHelpers = require('./../TestHelpers')
// tape('other.01', (t) => {
//   t.plan(1)
//   var projectName = 'UnitTestProj' + Date.now()
//   TestHelpers.launch((plumbing, teardown) => {
//     var folder = () => { return plumbing.subprocs[0]._attributes.folder }
//     return async.series([
//       function (cb) { return plumbing.authenticateUser('matthew+matthew@haiku.ai', 'supersecure', cb) },
//       function (cb) { return plumbing.createProject(projectName, cb) },

//       // Initially create the project
//       function (cb) {
//         return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', (err) => {
//           if (err) return cb(err)
//           return plumbing.startProject(projectName, folder(), cb)
//         })
//       },

//       // Add some content
//       function (cb) {
//         fse.outputFileSync(path.join(folder(), 'Uno.txt'), '1')
//         fse.outputFileSync(path.join(folder(), 'Dos.txt'), '2')
//         fse.outputFileSync(path.join(folder(), 'Tres.txt'), '3')
//         fse.outputFileSync(path.join(folder(), 'Quatro.txt'), '4')
//         fse.outputFileSync(path.join(folder(), 'Cinco.txt'), '5')
//         return cb()
//       },

//       // Now reinitialize a bunch of times,
//       // as though we had gone back and forth
//       // between the dash and editor
//       function (cb) {
//         return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', (err) => {
//           if (err) return cb(err)
//           return plumbing.startProject(projectName, folder(), cb)
//         })
//       },
//       function (cb) {
//         return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', (err) => {
//           if (err) return cb(err)
//           return plumbing.startProject(projectName, folder(), cb)
//         })
//       },

//       // Update some content
//       function (cb) {
//         fse.outputFileSync(path.join(folder(), 'Uno.txt'), '11')
//         fse.outputFileSync(path.join(folder(), 'Dos.txt'), '22')
//         fse.outputFileSync(path.join(folder(), 'Tres.txt'), '33')
//         fse.outputFileSync(path.join(folder(), 'Quatro.txt'), '44')
//         fse.outputFileSync(path.join(folder(), 'Cinco.txt'), '55')
//         return cb()
//       },

//       function (cb) {
//         return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', (err) => {
//           if (err) return cb(err)
//           return plumbing.startProject(projectName, folder(), cb)
//         })
//       },
//       function (cb) {
//         return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', (err) => {
//           if (err) return cb(err)
//           return plumbing.startProject(projectName, folder(), cb)
//         })
//       },


//       // Update some content
//       function (cb) {
//         fse.outputFileSync(path.join(folder(), 'Uno.txt'), '111')
//         fse.outputFileSync(path.join(folder(), 'Dos.txt'), '222')
//         fse.outputFileSync(path.join(folder(), 'Tres.txt'), '333')
//         fse.outputFileSync(path.join(folder(), 'Quatro.txt'), '444')
//         fse.outputFileSync(path.join(folder(), 'Cinco.txt'), '555')
//         return cb()
//       },

//       function (cb) {
//         return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', (err) => {
//           if (err) return cb(err)
//           return plumbing.startProject(projectName, folder(), cb)
//         })
//       },

//       // Update some content
//       function (cb) {
//         fse.outputFileSync(path.join(folder(), 'Uno.txt'), '1111')
//         fse.outputFileSync(path.join(folder(), 'Dos.txt'), '2222')
//         fse.outputFileSync(path.join(folder(), 'Tres.txt'), '3333')
//         fse.outputFileSync(path.join(folder(), 'Quatro.txt'), '4444')
//         fse.outputFileSync(path.join(folder(), 'Cinco.txt'), '5555')
//         return cb()
//       },

//       function (cb) {
//         return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', (err) => {
//           if (err) return cb(err)
//           return plumbing.startProject(projectName, folder(), cb)
//         })
//       },
//       function (cb) {
//         return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', (err) => {
//           if (err) return cb(err)
//           return plumbing.startProject(projectName, folder(), cb)
//         })
//       },
//       function (cb) {
//         return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', (err) => {
//           if (err) return cb(err)
//           return plumbing.startProject(projectName, folder(), cb)
//         })
//       },
//       function (cb) {
//         return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', (err) => {
//           if (err) return cb(err)
//           return plumbing.startProject(projectName, folder(), cb)
//         })
//       },

//       // Update some content
//       function (cb) {
//         fse.outputFileSync(path.join(folder(), 'Uno.txt'), '11111')
//         fse.outputFileSync(path.join(folder(), 'Dos.txt'), '22222')
//         fse.outputFileSync(path.join(folder(), 'Tres.txt'), '33333')
//         fse.outputFileSync(path.join(folder(), 'Quatro.txt'), '44444')
//         fse.outputFileSync(path.join(folder(), 'Cinco.txt'), '55555')
//         return cb()
//       },

//       function (cb) {
//         return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', (err) => {
//           if (err) return cb(err)
//           return plumbing.startProject(projectName, folder(), cb)
//         })
//       },
//       function (cb) {
//         return plumbing.initializeProject(projectName, { projectName, skipContentCreation: true }, 'matthew+matthew@haiku.ai', 'supersecure', (err) => {
//           if (err) return cb(err)
//           return plumbing.startProject(projectName, folder(), cb)
//         })
//       },

//       function (cb) { return plumbing.deleteProject(projectName, cb) }
//     ], (err) => {
//       if (err) throw err
//       t.ok(true)
//       teardown()
//     })
//   })
// })
