var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
process.env.HAIKU_SKIP_NPM_INSTALL = '1'
tape('mergeDesign.sketch', (t) => {
  t.plan(3)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    var beforeSourcePath = path.join(__dirname, '..', 'fixtures', 'files', 'sketch', 'SparrowSez-before', 'SparrowSez3.sketch')
    var afterSourcePath = path.join(__dirname, '..', 'fixtures', 'files', 'sketch', 'SparrowSez-after', 'SparrowSez3.sketch')
    glass.on('meow', (message) => { return glass.message(message) }) // Auto-respond as mock
    timeline.on('meow', (message) => { return timeline.message(message) }) // Auto-respond as mock
    return async.series([
      function (cb) { return creator.request('initializeProject', ['test', { projectPath: folder }, 'matthew+test@haiku.ai', 'quitesecure'], cb) },
      function (cb) { return creator.request('startProject', ['test', folder], cb) },
      function (cb) { return creator.action('linkAsset', [folder, beforeSourcePath], cb) },

// -9.svg
// card bg.svg
// guage bg copy 3.svg
// indie3.svg
// Mask.svg
// Mostly the new Quinn Copy 2.svg
// thumb copy 2.svg

      // function (cb) { return setTimeout(cb, 1000) },
      // function (cb) {
      //   // Changing the fill color over to red, which should flood into the bytecode
      //   fse.writeFileSync(instpath, '<svg><rect x="0" y="0" stroke="1" fill="red"></rect></svg>')
      //   return cb()
      // },

      // function (cb) { return setTimeout(cb, 2000) },
      // function (cb) {
      //   for (var key in require.cache) delete require.cache[key]
      //   var bytecode = require(path.join(folder, 'code', 'main', 'code.js'))
      //   var hid = bytecode.template.children[0].children[0].attributes['haiku-id']
      //   t.equal(bytecode.timelines.Default['haiku:' + hid].fill[0].value, 'red', 'color change 1 ok')
      //   return cb()
      // },

      // function (cb) { return setTimeout(cb, 1000) },
      // function (cb) {
      //   // Changing the fill color over to red, which should flood into the bytecode
      //   fse.writeFileSync(instpath, '<svg><rect x="0" y="0" stroke="1" fill="blue"></rect></svg>')
      //   return cb()
      // },

      // function (cb) { return setTimeout(cb, 2000) },
      // function (cb) {
      //   for (var key in require.cache) delete require.cache[key]
      //   var bytecode = require(path.join(folder, 'code', 'main', 'code.js'))
      //   var hid = bytecode.template.children[0].children[0].attributes['haiku-id']
      //   t.equal(bytecode.timelines.Default['haiku:' + hid].fill[0].value, 'blue', 'color change 2 ok')
      //   return cb()
      // },
    ], (err) => {
      t.error(err, 'no error')
      // teardown()
    })
  })
})
