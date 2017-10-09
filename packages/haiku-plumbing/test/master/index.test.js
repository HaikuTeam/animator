var tape = require('tape')
var async = require('async')
var fse = require('haiku-fs-extra')
var path = require('path')
var TestHelpers = require('./../TestHelpers')
tape('master:index', (t) => {
  t.plan(2)
  TestHelpers.setup(function(folder, creator, glass, timeline, metadata, teardown) {
    fse.writeFileSync(path.join(folder, 'Hello.svg'), '<svg><rect x="0" y="0" stroke="1" fill="black"></rect></svg>')
    return async.series([
      function (cb) { return creator.request('initializeProject', ['test', { projectPath: folder }, 'matthew+test@haiku.ai', 'quitesecure'], cb) },

      // TODO: Move this step to its own test?
      function (cb) {
        var pkg = fse.readJsonSync(path.join(folder, 'package.json'))
        t.equal(pkg.name, `@haiku/${metadata.organizationName.toLowerCase()}-test`, 'organization name was set correctly')
        return cb()
      }
    ], (err) => {
      t.error(err, 'no error')
      teardown()
    })
  })
})
