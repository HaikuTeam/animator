'use strict'

var test = require('tape')
var upsertRequire = require('./../../src/ast/upsertRequire')
var generateCode = require('./../../src/ast/generatecode')
var ActiveComponent = require('./../../src/bll/ActiveComponent')
var File = require('./../../src/bll/File')
var path = require('path')

test('upsertRequire', function (t) {
  t.plan(2)
  var ac = new ActiveComponent({
    alias: 'test',
    uid: path.join(__dirname, '..', 'fixtures', 'projects', 'james') + '::' + undefined,
    folder: path.join(__dirname, '..', 'fixtures', 'projects', 'james'),
    userconfig: {},
    websocket: { send: () => {}, on: () => {} },
    platform: {},
    envoy: { mock: true }
  })
  ac.fetchActiveBytecodeFile().doShallowWorkOnly = false // We would like to see diffs of the operations during this test
  File.UPDATE_OPTIONS.shouldUpdateFileSystem = false // Don't clobber the test fixtures
  ac.mountApplication()
  ac.on('update', (what) => {
    if (what === 'application-mounted') {
      ac.instance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
      var file = ac.fetchActiveBytecodeFile() // File
      file.read((err) => { // Reload the full content from the file system, including the ast so we can diff log etc
        upsertRequire(file.ast, 'HaikuPath', '@haiku/player/components/Path')

        var expectation = 'var HaikuPath = require("@haiku/player/components/Path");module.exports = {\n  timelines: {},\n  template: {\n    elementName: \'div\',\n    attributes: {},\n    children: [] } };'
        var code = generateCode(file.ast)
        t.equal(code, expectation)

        // should be idempotent
        upsertRequire(file.ast, 'HaikuPath', '@haiku/player/components/Path')
        var code = generateCode(file.ast)
        t.equal(code, expectation)
      })
    }
  })
})
