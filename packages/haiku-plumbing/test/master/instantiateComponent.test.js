var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
process.env.HAIKU_SKIP_NPM_INSTALL = '1'
tape('instantiateComponent', (t) => {
  t.plan(4)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    var instpath = path.join(folder, 'Hello.svg')
    fse.writeFileSync(instpath, '<svg><rect x="0" y="0" stroke="1" fill="black"></rect></svg>')
    glass.on('meow', (message) => { return glass.message(message) }) // Auto-respond as mock
    timeline.on('meow', (message) => { return timeline.message(message) }) // Auto-respond as mock
    return async.series([
      function (cb) { return creator.request('initializeProject', ['test', { projectPath: folder }, 'matthew+test@haiku.ai', 'quitesecure'], cb) },
      function (cb) { return creator.request('startProject', ['test', folder], cb) },
      function (cb) { return creator.action('instantiateComponent', [folder, instpath, {}], cb) },
      function (cb) {
        setTimeout(() => { // Wait for the debounced file system update to finish
          for (var key in require.cache) delete require.cache[key]
          var bytecode = require(path.join(folder, 'code', 'main', 'code.js'))
          t.equal(bytecode.template.children[0].elementName, 'svg', 'svg 1 was instantiated')
          return cb()
        }, 1000)
      },

      function (cb) { return creator.action('instantiateComponent', [folder, instpath, {}], cb) },
      function (cb) {
        setTimeout(() => { // Wait for the debounced file system update to finish
          for (var key in require.cache) delete require.cache[key]
          var bytecode = require(path.join(folder, 'code', 'main', 'code.js'))
          t.equal(bytecode.template.children[1].elementName, 'svg', 'svg 2 was instantiated')
          return cb()
        }, 1000)
      },

      function (cb) { return creator.action('instantiateComponent', [folder, instpath, {}], cb) },
      function (cb) {
        setTimeout(() => { // Wait for the debounced file system update to finish
          for (var key in require.cache) delete require.cache[key]
          var bytecode = require(path.join(folder, 'code', 'main', 'code.js'))
          t.equal(bytecode.template.children[2].elementName, 'svg', 'svg 3 was instantiated')
          return cb()
        }, 1000)
      }
    ], (err) => {
      t.error(err, 'no error')
      teardown()
    })
  })
})
