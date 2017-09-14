var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
tape('ProjectFolder.fixProjectName', (t) => {
  t.plan(3)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    fse.writeFileSync(path.join(folder, 'Hello.svg'), '<svg><rect x="0" y="0" stroke="1" fill="black"></rect></svg>')
    return async.series([
      function (cb) { return creator.request('initializeProject', ['test', { projectPath: folder }, 'matthew+test@haiku.ai', 'quitesecure'], cb) },

      function (cb) {
        var pkg = fse.readJsonSync(path.join(folder, 'package.json'))
        // Make sure the setting is correct at the outset
        t.equal(pkg.name, `@haiku/${metadata.organizationName.toLowerCase()}-test`, 'package name was set correctly')
        // Set to an incorrect name to check that we fix it correctly later
        pkg.name = '@haiku/unknown-test'
        fse.writeJsonSync(path.join(folder, 'package.json'), pkg, { spaces: 2 })
        return cb()
      },

      // Re-run the same initialization step, which should fix the name
      function (cb) { return creator.request('initializeProject', ['test', { projectPath: folder }, 'matthew+test@haiku.ai', 'quitesecure'], cb) },

      function (cb) {
        var pkg = fse.readJsonSync(path.join(folder, 'package.json'))
        t.equal(pkg.name, `@haiku/${metadata.organizationName.toLowerCase()}-test`, 'package name was set correctly')
        return cb()
      }
    ], (err) => {
      t.error(err, 'no error')
      teardown()
    })
  })
})
