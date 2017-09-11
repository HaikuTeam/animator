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
    glass.on('meow', (message) => { if (message.type !== 'broadcast') return glass.message(message) }) // Auto-respond as mock
    timeline.on('meow', (message) => { if (message.type !== 'broadcast') return timeline.message(message) }) // Auto-respond as mock
    return async.series([
      function (cb) { return creator.request('initializeProject', ['test', { projectPath: folder }, 'matthew+test@haiku.ai', 'quitesecure'], cb) },
      function (cb) { return creator.request('startProject', ['test', folder], cb) },
      function (cb) { return creator.action('linkAsset', [folder, beforeSourcePath], cb) },
      function (cb) { return setTimeout(cb, 10000) },
      function (cb) { return creator.action('instantiateComponent', [folder, path.join(folder, `designs/SparrowSez3.sketch.contents/slices/-9.svg`), {}], cb) },
      function (cb) { return creator.action('instantiateComponent', [folder, path.join(folder, `designs/SparrowSez3.sketch.contents/slices/card bg.svg`), {}], cb) },
      function (cb) { return creator.action('instantiateComponent', [folder, path.join(folder, `designs/SparrowSez3.sketch.contents/slices/guage bg copy 3.svg`), {}], cb) },
      function (cb) { return creator.action('instantiateComponent', [folder, path.join(folder, `designs/SparrowSez3.sketch.contents/slices/indie3.svg`), {}], cb) },
      function (cb) { return creator.action('instantiateComponent', [folder, path.join(folder, `designs/SparrowSez3.sketch.contents/slices/Mask.svg`), {}], cb) },
      function (cb) { return creator.action('instantiateComponent', [folder, path.join(folder, `designs/SparrowSez3.sketch.contents/slices/Mostly the new Quinn Copy 2.svg`), {}], cb) },
      function (cb) { return creator.action('instantiateComponent', [folder, path.join(folder, `designs/SparrowSez3.sketch.contents/slices/thumb copy 2.svg`), {}], cb) },
      function (cb) { return setTimeout(cb, 5000) }
    ], (err) => {
      t.error(err, 'no error')
      // teardown()
    })
  })
})
