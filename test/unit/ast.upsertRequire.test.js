'use strict'

var test = require('tape')
var upsertRequire = require('./../../src/ast/upsertRequire')
var generateCode = require('./../../src/ast/generatecode')
var ActiveComponent = require('./../../src/model/ActiveComponent')
var path = require('path')

test('upsertRequire', function (t) {
  t.plan(2)
  var ac = new ActiveComponent({
    alias: 'test',
    folder: path.join(__dirname, '..', 'fixtures', 'projects', 'james'),
    userconfig: {},
    websocket: { send: () => {}, on: () => {} },
    platform: {},
    envoy: { mock: true }
  })
  ac.fetchActiveBytecodeFile().set('doShallowWorkOnly', false) // We would like to see diffs of the operations during this test
  ac.FileModel.UPDATE_OPTIONS.shouldUpdateFileSystem = false // Don't clobber the test fixtures
  ac.mountApplication()
  ac.on('component:mounted', () => {
    ac._componentInstance._context.clock.GLOBAL_ANIMATION_HARNESS.cancel()
    var file = ac.fetchActiveBytecodeFile() // File
    file.read((err) => { // Reload the full content from the file system, including the ast so we can diff log etc
      var ast = file.get('ast')
      upsertRequire(ast, 'HaikuPath', '@haiku/player/components/Path')

      var expectation = 'var HaikuPath = require("@haiku/player/components/Path");module.exports = {\n  timelines: {},\n  template: {\n    elementName: \'div\',\n    attributes: {},\n    children: [] } };'
      var code = generateCode(ast)
      t.equal(code, expectation)

      // should be idempotent
      upsertRequire(ast, 'HaikuPath', '@haiku/player/components/Path')
      var code = generateCode(ast)
      t.equal(code, expectation)
    })
  })
})
