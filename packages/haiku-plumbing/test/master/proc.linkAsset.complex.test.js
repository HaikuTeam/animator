// var tape = require('tape')
// var async = require('async')
// var fse = require('haiku-fs-extra')
// var path = require('path')
// var TestHelpers = require('./../TestHelpers')
// tape('proc.instantiateComponent', (t) => {
//   t.plan(4)
//   var assetPath = path.join(__dirname, '..', 'fixtures', 'files', 'designs', 'bike.sketch')
//   TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
//     return async.series([
//       function (cb) { return creator.request('initializeProject', ['test', { projectPath: folder }, 'matthew+test@haiku.ai', 'quitesecure'], cb) },
//       function (cb) { return creator.request('startProject', ['test', folder], cb) },
//       // function (cb) {
//       //   return creator.request('linkAsset', [assetPath, folder], (err) => {
//       //     t.error(err, 'no error linking')
//       //   })
//       // }
//     ], (err) => {
//       t.error(err, 'no error')
//       teardown()
//     })
//   })
// })
